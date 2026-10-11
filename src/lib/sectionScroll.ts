const NAV_FALLBACK_HEIGHT = 88;
const GAP = 8;

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return false;

  const nav = document.querySelector("nav");
  const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : NAV_FALLBACK_HEIGHT;
  const top = element.getBoundingClientRect().top + window.scrollY - navHeight - GAP;

  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  return true;
}

/**
 * Va directement à une section de la page d'accueil, sans faire défiler
 * les sections intermédiaires. La section s'arrête juste sous la barre
 * de navigation fixe, son titre reste donc entièrement visible.
 */
export function jumpToSection(id: string) {
  scrollToSection(id);
}

/**
 * Variante utilisée à l'arrivée depuis une autre page : les photos peuvent
 * encore se charger et pousser la section plus bas, on réajuste donc le saut
 * quelques fois tant que la mise en page bouge (et jamais si le visiteur
 * fait lui-même défiler la page).
 */
export function jumpToSectionAndSettle(id: string) {
  if (!scrollToSection(id)) return;

  const timers: number[] = [];
  let stopped = false;

  const stop = () => {
    stopped = true;
    timers.forEach(clearTimeout);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };

  ["wheel", "touchstart", "keydown"].forEach((event) =>
    window.addEventListener(event, stop, { passive: true })
  );
  window.addEventListener("load", () => !stopped && scrollToSection(id), { once: true });

  [120, 300, 600, 1000, 1500].forEach((delay) => {
    timers.push(window.setTimeout(() => !stopped && scrollToSection(id), delay));
  });
}
