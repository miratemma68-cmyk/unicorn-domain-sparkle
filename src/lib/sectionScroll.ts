const NAV_FALLBACK_HEIGHT = 88;
const GAP = 8;

/**
 * Va directement à une section de la page d'accueil, sans faire défiler
 * les sections intermédiaires. La section s'arrête juste sous la barre
 * de navigation fixe, son titre reste donc entièrement visible.
 */
export function jumpToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const nav = document.querySelector("nav");
  const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : NAV_FALLBACK_HEIGHT;
  const top = element.getBoundingClientRect().top + window.scrollY - navHeight - GAP;

  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}
