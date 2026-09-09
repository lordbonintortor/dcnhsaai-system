"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { heroSlides } from "@/lib/hero-slides";
import styles from "./hero-carousel.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

export default function HeroCarousel({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [playback, setPlayback] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion);
  const playing = playback ?? !reducedMotion;
  const rotating = playing && !hovered;

  useEffect(() => {
    if (!rotating) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % heroSlides.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [rotating]);

  function showSlide(index: number) {
    setPlayback(false);
    setActive((index + heroSlides.length) % heroSlides.length);
  }

  return (
    <section
      id="top"
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Alumni community photos"
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]")) setPlayback(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          showSlide(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onTouchStart={(event) => {
        if (event.touches.length !== 1 || (event.target as HTMLElement).closest("button, a")) {
          touchStart.current = null;
          return;
        }
        touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showSlide(active + (dx < 0 ? 1 : -1));
      }}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <div className={styles.slides} id="alumni-hero-slides" aria-live={rotating ? "off" : "polite"} aria-atomic="true">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`${styles.slide} ${index === active ? styles.active : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroSlides.length}: ${slide.title}`}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 560px) 1400px, (max-width: 900px) 1200px, 100vw"
              className={styles.photo}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable={false}
            />
            <div className={styles.shade} />
          </div>
        ))}
      </div>

      <div className={styles.topline}>
        <span className={styles.sample}>Sample imagery</span>
      </div>

      <div className={styles.content}>{children}</div>

      <div
        className={styles.controls}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className={`${styles.control} ${styles.playback}`}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          aria-controls="alumni-hero-slides"
          data-rotation-control
          onClick={() => setPlayback(!playing)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            {playing ? <path d="M6 4v12M14 4v12" stroke="currentColor" strokeWidth="2.5" /> : <path d="m6 3 11 7-11 7Z" fill="currentColor" />}
          </svg>
        </button>
        <div className={styles.position}>
          <span className={styles.counter} aria-hidden="true">0{active + 1}<span> / 0{heroSlides.length}</span></span>
          <div className={styles.dots} role="group" aria-label="Choose a slide">
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={slide.src}
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                aria-current={index === active ? "true" : undefined}
                aria-controls="alumni-hero-slides"
                onClick={() => showSlide(index)}
              ><span /></button>
            ))}
          </div>
        </div>
        <div className={styles.caption} aria-hidden="true">
          <p>{heroSlides[active].category}</p>
          <h2>{heroSlides[active].title}</h2>
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.control} aria-label="Previous slide" aria-controls="alumni-hero-slides" onClick={() => showSlide(active - 1)}><span aria-hidden="true">←</span></button>
          <button type="button" className={`${styles.control} ${styles.next}`} aria-label="Next slide" aria-controls="alumni-hero-slides" onClick={() => showSlide(active + 1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  );
}
