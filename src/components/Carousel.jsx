import { useCallback, useEffect, useRef, useState } from "react";
import { CAROUSEL_SLIDES, CAROUSEL_INTERVAL } from "../data/site.js";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons.jsx";

// Hero image carousel. The photos sit on the right of the hero and fade into its background;
// slides cross-fade automatically, with arrows, dots and touch swipe.
// Auto-play pauses while the mouse is over it or a control has keyboard focus.
export default function Carousel() {
  const slides = CAROUSEL_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const go = useCallback((i) => setIndex((i + slides.length) % slides.length), [slides.length]);

  // Restarting this timer on every change means a manual click always gets a full interval.
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), CAROUSEL_INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, slides.length]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Qazi Medicine Company stock"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel__media">
        {slides.map((s, i) => (
          <div
            className={`carousel__slide ${i === index ? "is-active" : ""}`}
            key={s.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
          >
            <img src={`${import.meta.env.BASE_URL}${s.src}`} alt={s.alt} draggable="false" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" className="carousel__btn carousel__btn--prev" onClick={() => go(index - 1)} aria-label="Previous photo">
            <ChevronLeftIcon size={20} />
          </button>
          <button type="button" className="carousel__btn carousel__btn--next" onClick={() => go(index + 1)} aria-label="Next photo">
            <ChevronRightIcon size={20} />
          </button>
          <div className="carousel__dots">
            {slides.map((s, i) => (
              <button key={s.src} type="button" className={i === index ? "is-active" : ""} onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
