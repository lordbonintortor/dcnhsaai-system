import Link from "next/link";
import Image from "next/image";

const professions = ["Legal", "Medical", "Engineering", "Finance", "Information Technology", "Entrepreneur", "Retired", "Other"];

export default function RegisterPage() {
  return (
    <main className="form-page">
      <aside className="form-aside">
        <Link className="brand" href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} priority /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link>
        <div><p className="eyebrow">Alumni registry</p><h1>Every batch.<br/><em>One community.</em></h1><p>Help us build a verified and connected alumni network for generations of City High graduates.</p></div>
        <p className="aside-note">Your information will be reviewed by an authorized association officer and will not be publicly displayed.</p>
      </aside>
      <section className="form-panel">
        <div className="form-top"><Link href="/">← Back to website</Link><span>Already registered? <Link href="/login">Sign in</Link></span></div>
        <div className="form-wrap">
          <p className="step-label">Step 1 of 2 · Alumni information</p>
          <h2>Join the alumni registry</h2>
          <p className="form-intro">Fields marked with <b>*</b> are required. This prototype does not submit or save data yet.</p>
          <form>
            <fieldset><legend>School information</legend><div className="field-grid three"><label>Batch year *<input type="number" placeholder="e.g. 2008" /></label><label>Section<input placeholder="e.g. Rizal" /></label><label>Class adviser<input placeholder="Full name" /></label></div></fieldset>
            <fieldset><legend>Personal information</legend><div className="field-grid"><label>First name *<input placeholder="First name" /></label><label>Middle or maiden name<input placeholder="Optional" /></label><label>Last name *<input placeholder="Last name" /></label><label>Email address *<input type="email" placeholder="you@example.com" /></label><label>Mobile number<input type="tel" placeholder="+63 9XX XXX XXXX" /></label></div></fieldset>
            <fieldset><legend>Profession / occupation</legend><p className="field-help">Select all that apply.</p><div className="checkbox-grid">{professions.map((item)=><label key={item}><input type="checkbox" /> <span>{item}</span></label>)}</div><label className="full-field">Current and past employers or businesses<textarea rows={3} placeholder="Up to three entries" /></label></fieldset>
            <label className="consent"><input type="checkbox" /> <span>I confirm that the information above is accurate and consent to its use for alumni verification and association purposes. *</span></label>
            <button className="button submit-button" type="button">Continue to account setup <span>→</span></button>
          </form>
        </div>
      </section>
    </main>
  );
}
