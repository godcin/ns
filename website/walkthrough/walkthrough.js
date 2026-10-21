(() => {
  "use strict";
  window.lucide?.createIcons();
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mobile-nav");
  const closeMenu = () => {
    nav.hidden = true;
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "展开导航");
  };
  menu.hidden = false;
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "收起导航" : "展开导航");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !nav.hidden) { closeMenu(); menu.focus(); }
  });
  window.matchMedia("(min-width: 721px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });

  const dialog = document.querySelector("#shot-dialog");
  const image = document.querySelector("#shot-image");
  const title = document.querySelector("#shot-title");
  const sizeButton = document.querySelector(".shot-size");
  let opener;
  document.querySelectorAll(".shot-link").forEach(link => {
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
      event.preventDefault();
      opener = link;
      const source = link.querySelector("img");
      image.src = link.href;
      image.alt = source.alt;
      image.width = source.naturalWidth;
      image.height = source.naturalHeight;
      title.textContent = link.dataset.caption;
      dialog.classList.remove("is-actual");
      sizeButton.textContent = "原尺寸";
      sizeButton.setAttribute("aria-pressed", "false");
      dialog.showModal();
      document.body.classList.add("dialog-open");
      dialog.querySelector(".shot-scroll").scrollTo(0, 0);
    });
  });
  sizeButton.addEventListener("click", () => {
    const actual = dialog.classList.toggle("is-actual");
    sizeButton.textContent = actual ? "适应屏幕" : "原尺寸";
    sizeButton.setAttribute("aria-pressed", String(actual));
  });
  dialog.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    opener?.focus({ preventScroll: true });
  });

  const stages = [...document.querySelectorAll(".story-stage")];
  const stageLinks = [...document.querySelectorAll(".stage-nav a")];
  let scheduled = false;
  const updateStage = () => {
    scheduled = false;
    const active = [...stages].reverse().find(stage => stage.getBoundingClientRect().top <= 180) || stages[0];
    stageLinks.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateStage); }
  }, { passive: true });
  updateStage();
})();
