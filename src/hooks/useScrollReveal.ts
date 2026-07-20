import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, the class "is-visible" is added,
 * triggering CSS reveal transitions defined in styles.css.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // fire once
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Observe multiple children of a container and stagger their reveals.
 * Attach the returned ref to the parent element.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLElement>(
  childSelector = "[data-reveal]",
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;

    const children = Array.from(parent.querySelectorAll<HTMLElement>(childSelector));
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 60}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px", ...options },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [childSelector]);

  return ref;
}
