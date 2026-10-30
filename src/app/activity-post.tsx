"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/account-api";
import { useAccount } from "@/lib/use-account";

type Props = {
  slug: string;
  images: ReadonlyArray<{ src: string; alt: string }>;
};

type ActivityImage = { src: string; alt: string };

export default function ActivityPost({ slug, images }: Props) {
  const { profile, ready } = useAccount();
  const [reaction, setReaction] = useState({ count: 0, liked: false });
  const [selectedImage, setSelectedImage] = useState<ActivityImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void api<{ count: number; liked: boolean }>(`/api/activity-reactions/${slug}`).then(setReaction).catch(() => setError("Reactions are temporarily unavailable."));
  }, [slug]);

  useEffect(() => {
    if (!selectedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedImage]);

  async function toggleLike() {
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      setReaction(await api<{ count: number; liked: boolean }>(`/api/activity-reactions/${slug}`, "POST", { reaction: "like" }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The reaction could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="activity-post">
      <div className="activity-gallery">
        {images.map((image, index) => (
          <button className={index === 0 ? "activity-image activity-image-feature" : "activity-image"} key={image.src} type="button" onClick={() => setSelectedImage(image)} aria-label={`View ${image.alt} larger`}>
            <Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 66vw" : "(max-width: 760px) 100vw, 33vw"} quality={75} />
          </button>
        ))}
      </div>
      <div className="activity-actions">
        {profile ? (
          <button className={`reaction-button${reaction.liked ? " is-liked" : ""}`} type="button" onClick={toggleLike} disabled={saving || !ready}>
            <span aria-hidden="true">♥</span> {reaction.liked ? "Liked" : "Like"} · {reaction.count}
          </button>
        ) : (
          <Link className="reaction-button" href="/login">Sign in to like · {reaction.count}</Link>
        )}
      </div>
      {error && <p className="activity-error" role="status">{error}</p>}
      {selectedImage && (
        <div className="activity-lightbox" role="dialog" aria-modal="true" aria-label="Expanded activity image" onClick={() => setSelectedImage(null)}>
          <button className="activity-lightbox-close" type="button" onClick={() => setSelectedImage(null)} aria-label="Close expanded image">×</button>
          <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="100vw" quality={85} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
