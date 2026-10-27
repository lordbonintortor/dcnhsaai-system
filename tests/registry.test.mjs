import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const applicant = "10000000-0000-4000-8000-000000000001";
const peer = "10000000-0000-4000-8000-000000000002";
const officer = "10000000-0000-4000-8000-000000000003";
const details = { firstName: "Jamie", middleName: "", lastName: "Reyes", batchYear: "2015", section: "", adviser: "", mobile: "", professions: ["Engineering"], otherProfession: "", employers: "" };

before(async () => {
  // Supabase owns these schemas in production. Here we supply only their SQL contract.
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    grant usage on schema auth to anon,authenticated;
    create schema storage;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
    create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;
    alter table storage.objects enable row level security;
    grant usage on schema storage to authenticated;
    grant select,insert,delete on storage.objects to authenticated;
  `);
  try {
    await db.exec(await readFile(new URL("../supabase/migrations/202610260001_alumni_registry.sql", import.meta.url), "utf8"));
    // Upgrade an existing reviewed account, rather than testing only an empty schema.
    await db.query("insert into auth.users(id,email,raw_user_meta_data) values($1,'legacy@example.com',$2)", [applicant, JSON.stringify({ alumni: details, graduateConsent: true })]);
    await db.query("update public.alumni_profiles set verification='verified',version=3 where id=$1", [applicant]);
    const existing = (await db.query("select * from public.alumni_profiles where id=$1", [applicant])).rows[0];
    await db.query("insert into auth.users(id,email) values($1,'officer@example.com')", [officer]);
    await db.query("insert into public.officers(user_id,display_name) values($1,'Existing officer')", [officer]);
    await db.query("insert into public.application_reviews(applicant_id,status,actor,actor_id,reviewer,message) values($1,'verified','officer',$2,'Existing officer','')", [applicant, officer]);
    const authBefore = (await db.query("select * from auth.users order by id")).rows;
    const reviewsBefore = (await db.query("select * from public.application_reviews")).rows;
    if (process.env.TEST_PREVIOUS_USERNAME_MIGRATION === "1") {
      await db.exec(await readFile(new URL("../supabase/migrations/202610270001_username_accounts.sql", import.meta.url), "utf8"));
      await db.query("update public.alumni_profiles set username='chosen_before' where id=$1", [applicant]);
    }
    await db.exec(await readFile(new URL("../supabase/migrations/202610270002_username_only.sql", import.meta.url), "utf8"));
    const upgraded = (await db.query("select * from public.alumni_profiles where id=$1", [applicant])).rows[0];
    const { email: removedEmail, ...retained } = existing;
    assert.equal(removedEmail, "legacy@example.com");
    assert.deepEqual(upgraded, { ...retained, username: process.env.TEST_PREVIOUS_USERNAME_MIGRATION === "1" ? "chosen_before" : "member_100000000000" });
    assert.deepEqual((await db.query("select * from auth.users order by id")).rows, authBefore);
    assert.deepEqual((await db.query("select * from public.application_reviews")).rows, reviewsBefore);
    assert.equal((await db.query("select username from public.account_usernames where user_id=$1", [officer])).rows[0].username, "officer_100000000000");
  } catch (cause) { throw new Error(`Migration failed: ${cause.message} at position ${cause.position ?? "unknown"}`); }
});
after(async () => { await db.close(); });
beforeEach(async () => {
  await db.exec("truncate auth.users cascade; truncate storage.objects;");
  for (const [id, firstName] of [[applicant, "Jamie"], [peer, "Alex"]]) {
    await db.query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)", [id, `${firstName.toLowerCase()}@alumni.dcnhsaai.invalid`, JSON.stringify({ username: firstName.toLowerCase(), alumni: { ...details, firstName }, graduateConsent: true })]);
  }
  await db.query("insert into auth.users(id,email) values($1,'officer@example.com')", [officer]);
  await db.query("insert into public.officers(user_id,display_name) values($1,'Authorized officer')", [officer]);
});

async function asUser(id, run, role = "authenticated") {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id ?? ""]);
  try { return await run(); }
  finally { await db.exec("reset role"); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
const review = (id, version, status, message = "") => db.query("select public.review_alumni_application($1,$2,$3,$4)", [id, version, status, message]);
const save = (values, version, changedPhoto = false, path = null) => db.query("select public.save_alumni_profile($1,$2,$3,$4)", [JSON.stringify(values), version, changedPhoto, path]);
const profile = async id => (await db.query("select * from public.alumni_profiles where id=$1", [id])).rows[0];

const usernameId = "10000000-0000-4000-8000-000000000004";
const signupUsername = (username, authEmail = "jamie_new@alumni.dcnhsaai.invalid", id = usernameId) => db.query(
  "insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)",
  [id, authEmail, JSON.stringify({ username, alumni: details, graduateConsent: true })],
);

test("username signup needs no email field, normalizes case, and enforces identity binding and global uniqueness", async () => {
  await signupUsername(" Jamie_New ");
  assert.equal((await profile(usernameId)).username, "jamie_new");
  assert.equal(Object.hasOwn(await profile(usernameId), "email"), false);
  assert.equal((await profile(usernameId)).verification, "pending");
  await assert.rejects(signupUsername("JAMIE_NEW", undefined, randomUUID()), /account_usernames_username_key/i);
  await assert.rejects(signupUsername("someone_else", "wrong@example.com", randomUUID()), /does not match/i);
  await assert.rejects(signupUsername("ab", undefined, randomUUID()), /Invalid username/);
  await assert.rejects(signupUsername(null, undefined, randomUUID()), /Invalid username/);
  await db.query("select private.set_account_username($1,'reserved_officer')", [officer]);
  await assert.rejects(signupUsername("reserved_officer", "reserved_officer@alumni.dcnhsaai.invalid", randomUUID()), /account_usernames_username_key/i);
});

test("profile edits cannot restore email or change the sign-in username; stale edits remain rejected", async () => {
  await signupUsername("jamie_new");
  await asUser(usernameId, async () => {
    await save({ ...details, email: "discard@example.com", username: "hijack" }, 1);
    await assert.rejects(save(details, 1), /changed/);
    const row = await profile(usernameId);
    assert.equal(row.username, "jamie_new");
    assert.equal(Object.hasOwn(row, "email"), false);
    assert.equal(Object.hasOwn(row.details, "email"), false);
    assert.equal(Object.hasOwn(row.details, "username"), false);
    await assert.rejects(db.query("update public.alumni_profiles set username='hijack' where id=$1", [usernameId]), /permission denied/);
  });
});

test("only the server can resolve usernames; only the operator can assign or rename them", async () => {
  for (const [id, role] of [[null, "anon"], [applicant, "authenticated"], [officer, "authenticated"]]) {
    await asUser(id, async () => {
      assert.equal((await db.query("select public.username_only_ready() as ready")).rows[0].ready, true);
      await assert.rejects(db.query("select * from public.account_usernames"), /permission denied/);
      await assert.rejects(db.query("select private.set_account_username($1,'hijack')", [peer]), /permission denied/);
      await assert.rejects(db.query("insert into public.account_usernames values($1,'hijack')", [peer]), /permission denied/);
    }, role);
  }
  await asUser(null, async () => {
    assert.equal((await db.query("select user_id from public.account_usernames where username='jamie'")).rows[0].user_id, applicant);
    await assert.rejects(db.query("update public.account_usernames set username='hijack' where user_id=$1", [peer]), /permission denied/);
  }, "service_role");
  const authBefore = (await db.query("select * from auth.users order by id")).rows;
  await db.query("select private.set_account_username($1,'new_username')", [applicant]);
  assert.equal((await profile(applicant)).username, "new_username");
  assert.deepEqual((await db.query("select * from auth.users order by id")).rows, authBefore);
  await assert.rejects(db.query("select private.set_account_username($1,'new_username')", [peer]), /unique/);
});

test("signup validates graduation consent and creates only pending alumni", async () => {
  const row = await profile(applicant);
  assert.equal(row.verification, "pending");
  assert.equal(row.version, 1);
  assert.ok(row.consent_at);
  assert.equal((await db.query("select count(*)::int as n from public.alumni_profiles")).rows[0].n, 2);
  await assert.rejects(db.query("insert into auth.users(id,email,raw_user_meta_data) values(gen_random_uuid(),'bad@alumni.dcnhsaai.invalid',$1)", [JSON.stringify({ alumni: details, graduateConsent: false })]), /consent/i);
  await assert.rejects(db.query("insert into auth.users(id,email,raw_user_meta_data) values(gen_random_uuid(),'bad@alumni.dcnhsaai.invalid',$1)", [JSON.stringify({ username: "bad", alumni: { ...details, batchYear: "1900" }, graduateConsent: true })]), /batch year/i);
});

test("anonymous visitors cannot read private records or invoke account mutations", async () => {
  await asUser(null, async () => {
    for (const table of ["alumni_profiles", "officers", "application_reviews"]) await assert.rejects(db.query(`select * from public.${table}`), /permission denied/);
    await assert.rejects(review(applicant, 1, "verified"), /permission denied/);
    await assert.rejects(save(details, 1), /permission denied/);
    await assert.rejects(db.query("select * from public.alumni_member_profile($1)", [applicant]), /permission denied/);
    assert.deepEqual((await db.query("select * from public.alumni_directory()")).rows, []);
  }, "anon");
});

test("alumni cannot read another application, assign officer roles, approve themselves, or rewrite history", async () => {
  await asUser(applicant, async () => {
    assert.equal((await db.query("select id from public.alumni_profiles")).rows.length, 1);
    assert.equal((await db.query("select * from public.officers")).rows.length, 0);
    await assert.rejects(db.query("insert into public.officers(user_id,display_name) values($1,'Forged')", [applicant]), /permission denied/);
    await assert.rejects(db.query("update public.alumni_profiles set verification='verified' where id=$1", [applicant]), /permission denied/);
    await assert.rejects(review(applicant, 1, "verified"), /Officer access/);
    await assert.rejects(db.query("insert into public.application_reviews(applicant_id,status,actor,reviewer) values($1,'verified','officer','Forged')", [applicant]), /permission denied/);
    await assert.rejects(db.query("select * from public.alumni_member_profile($1)", [peer]), /approved alumni/);
    assert.equal((await db.query("select * from public.alumni_member_profile($1)", [applicant])).rows.length, 1);
  });
});

test("officer review records identity and time, requires messages, and rejects stale decisions", async () => {
  await asUser(officer, async () => {
    assert.equal((await db.query("select * from public.alumni_profiles")).rows.length, 2);
    await assert.rejects(review(applicant, 1, "needs_information", "   "), /message/);
    await assert.rejects(review(applicant, 1, "rejected", "x".repeat(1001)), /message/);
    assert.equal((await profile(applicant)).version, 1);
    await review(applicant, 1, "needs_information", "  Please correct your batch year.  ");
    await assert.rejects(review(applicant, 1, "verified"), /changed/);
    const history = (await db.query("select * from public.application_reviews where applicant_id=$1", [applicant])).rows;
    assert.equal(history.length, 1);
    assert.equal(history[0].reviewer, "Authorized officer");
    assert.equal(history[0].actor_id, officer);
    assert.equal(history[0].message, "Please correct your batch year.");
    assert.ok(history[0].reviewed_at);
    await assert.rejects(review(applicant, 2, "needs_information", "Again"), /already has/);
    await review(applicant, 2, "verified", "Discard this approval draft");
  });
  assert.equal((await profile(applicant)).verification, "verified");
  assert.equal((await db.query("select message from public.application_reviews where status='verified'")).rows[0].message, "");
});

test("correction and resubmission preserve review history and reject repeated resubmission", async () => {
  await asUser(officer, () => review(applicant, 1, "needs_information", "Please check the batch year."));
  await asUser(applicant, async () => {
    await save({ ...details, batchYear: "2016" }, 2);
    assert.equal((await profile(applicant)).verification, "needs_information");
    await db.query("select public.resubmit_alumni_application()");
    await assert.rejects(db.query("select public.resubmit_alumni_application()"), /Only applications/);
    assert.equal((await db.query("select * from public.application_reviews")).rows.length, 2);
  });
  assert.equal((await profile(applicant)).verification, "pending");
});

test("stale profile forms cannot overwrite reviews; identity changes require a new review", async () => {
  await asUser(officer, () => review(applicant, 1, "verified"));
  await asUser(applicant, async () => {
    await assert.rejects(save({ ...details, lastName: "Changed" }, 1), /changed/);
    await save({ ...details, mobile: "09123456789" }, 2);
    assert.equal((await profile(applicant)).verification, "verified");
    await save({ ...details, lastName: "Changed" }, 3);
    assert.equal((await profile(applicant)).verification, "pending");
    assert.equal((await db.query("select * from public.application_reviews")).rows.length, 2);
  });
});

test("directory exposes only approved names and batches; member lookup excludes private fields", async () => {
  await asUser(officer, async () => { await review(applicant, 1, "verified"); await review(peer, 1, "verified"); });
  await asUser(null, async () => {
    const rows = (await db.query("select * from public.alumni_directory()")).rows;
    assert.equal(rows.length, 2);
    assert.deepEqual(Object.keys(rows[0]).sort(), ["batchYear", "id", "name"]);
  }, "anon");
  await asUser(applicant, async () => {
    const rows = (await db.query("select * from public.alumni_member_profile($1)", [peer])).rows;
    assert.equal(rows.length, 1);
    assert.deepEqual(Object.keys(rows[0]).sort(), ["batchYear", "firstName", "id", "lastName", "otherProfession", "photo_path", "professions"]);
    assert.deepEqual((await db.query("select * from public.application_reviews where applicant_id=$1", [peer])).rows, []);
  });
});

test("photos are private, uploads stay in the owner folder, and arbitrary photo paths are rejected", async () => {
  const ownPath = `${applicant}/avatar.jpg`;
  const peerPath = `${peer}/avatar.jpg`;
  await asUser(applicant, async () => {
    await db.query("insert into storage.objects(bucket_id,name) values('alumni-photos',$1)", [ownPath]);
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('alumni-photos',$1)", [peerPath]), /row-level security/);
    await assert.rejects(save(details, 1, true, peerPath), /Invalid profile photo/);
    await save(details, 1, true, ownPath);
  });
  await asUser(peer, async () => { assert.equal((await db.query("select * from storage.objects")).rows.length, 0); });
  await asUser(officer, async () => {
    assert.equal((await db.query("select * from storage.objects")).rows.length, 1);
    await review(applicant, 2, "verified");
    await review(peer, 1, "verified");
  });
  await asUser(peer, async () => {
    assert.equal((await db.query("select * from storage.objects")).rows.length, 1);
    await db.query("delete from storage.objects where name=$1", [ownPath]);
    assert.equal((await db.query("select * from storage.objects")).rows.length, 1);
  });
  await asUser(officer, () => review(applicant, 3, "rejected", "Please contact us."));
  await asUser(peer, async () => { assert.equal((await db.query("select * from storage.objects")).rows.length, 0); });
});

test("profile validation rejects malformed and oversized fields even through direct RPC calls", async () => {
  await asUser(applicant, async () => {
    for (const invalid of [
      { ...details, professions: ["Forged"] }, { ...details, professions: [] },
      { ...details, professions: ["Other"], otherProfession: "" },
      { ...details, professions: [null] },
      { ...details, firstName: "x".repeat(201) }, { ...details, mobile: false },
    ]) await assert.rejects(save(invalid, 1));
    assert.equal((await profile(applicant)).version, 1);
  });
});
