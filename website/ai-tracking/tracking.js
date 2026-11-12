(() => {
  "use strict";

  window.lucide?.createIcons();

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "展开导航");
    menuToggle.title = "展开导航";
  };
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
    mobileNav.hidden = !expanded;
    menuToggle.setAttribute("aria-expanded", String(expanded));
    menuToggle.setAttribute("aria-label", expanded ? "收起导航" : "展开导航");
    menuToggle.title = expanded ? "收起导航" : "展开导航";
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const tabs = [...document.querySelectorAll("[data-filter]")];
  const items = [...document.querySelectorAll(".signal-item")];
  const search = document.querySelector("#tracking-search");
  const results = document.querySelector("#tracking-results");
  const count = document.querySelector("#tracking-count");
  const empty = document.querySelector("#tracking-empty");
  let activeFilter = "all";

  const updateResults = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const categories = item.dataset.categories.split(" ");
      const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
      const matchesQuery = !query || `${item.dataset.search} ${item.textContent}`.toLocaleLowerCase().includes(query);
      const show = matchesFilter && matchesQuery;
      item.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `显示 ${visible} 条`;
    empty.hidden = visible > 0;
  };

  const selectTab = (tab, focus = false) => {
    activeFilter = tab.dataset.filter;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    results.setAttribute("aria-labelledby", tab.id);
    updateResults();
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  search.addEventListener("input", updateResults);
})();
