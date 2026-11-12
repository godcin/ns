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

  const dateRail = document.querySelector("#timeline-dates");
  const categoryTabs = [...document.querySelectorAll("[data-filter]")];
  const search = document.querySelector("#tracking-search");
  const results = document.querySelector("#tracking-results");
  const grid = document.querySelector("#signal-grid");
  const count = document.querySelector("#tracking-count");
  const empty = document.querySelector("#tracking-empty");
  const error = document.querySelector("#tracking-error");
  const trend = document.querySelector("#trend-signal");
  const daysByDate = new Map();
  let activeDate = "";
  let activeFilter = "all";
  let days = [];

  const text = (value) => document.createTextNode(value || "");
  const icon = (name) => {
    const node = document.createElement("i");
    node.dataset.lucide = name;
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const link = (entry) => {
    const anchor = document.createElement("a");
    anchor.className = "text-link";
    anchor.href = entry.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(text(entry.linkLabel), icon("arrow-up-right"));
    return anchor;
  };

  const renderDateRail = () => {
    dateRail.replaceChildren();
    days.forEach((day, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.role = "tab";
      button.id = `timeline-date-${day.date}`;
      button.dataset.timelineDate = day.date;
      button.setAttribute("aria-controls", "tracking-results");
      button.setAttribute("aria-selected", String(day.date === activeDate));
      button.tabIndex = day.date === activeDate ? 0 : -1;
      const date = document.createElement("strong");
      date.textContent = day.label;
      const relative = document.createElement("span");
      relative.textContent = day.relative;
      button.append(date, relative);
      button.addEventListener("click", () => selectDate(day.date));
      button.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % days.length;
        if (event.key === "ArrowLeft") next = (index - 1 + days.length) % days.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = days.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectDate(days[next].date, true);
      });
      dateRail.append(button);
    });
  };

  const renderStats = (day) => {
    const stats = day.stats || {};
    document.querySelector("#stat-updates").textContent = stats.updates || 0;
    document.querySelector("#stat-industry").textContent = stats.industry || 0;
    document.querySelector("#stat-papers").textContent = stats.papers || 0;
    document.querySelector("#stat-trends").textContent = stats.trends || 0;
    const generated = document.querySelector("#tracking-updated-time");
    generated.dateTime = day.generatedAt;
    generated.textContent = day.generatedAtLabel;
  };

  const renderTrend = (day) => {
    const data = day.trend;
    trend.hidden = !data;
    if (!data) return;
    document.querySelector("#trend-title").textContent = data.title;
    document.querySelector("#trend-description").textContent = data.description;
    document.querySelector("#trend-volume").textContent = data.volume;
    document.querySelector("#trend-growth").textContent = data.growth;
    const observed = document.querySelector("#trend-observed");
    observed.dateTime = data.observedAt;
    observed.textContent = data.observed;
    document.querySelector("#trend-link").href = data.url;
  };

  const renderEntry = (entry) => {
    const article = document.createElement("article");
    article.className = "signal-item";
    const meta = document.createElement("div");
    meta.className = "signal-meta";
    const source = document.createElement("span");
    source.className = "signal-source";
    source.textContent = entry.source;
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = entry.date;
    const tag = document.createElement("span");
    tag.className = `signal-tag ${entry.tagClass || ""}`;
    tag.textContent = entry.tag;
    meta.append(source, date, tag);
    const heading = document.createElement("h3");
    heading.textContent = entry.title;
    const summary = document.createElement("p");
    summary.textContent = entry.summary;
    article.append(meta, heading, summary, link(entry));
    return article;
  };

  const updateResults = () => {
    const day = daysByDate.get(activeDate);
    if (!day) return;
    const query = search.value.trim().toLocaleLowerCase();
    const entries = day.entries.filter((entry) => {
      const categoryMatches = activeFilter === "all" || entry.category === activeFilter || entry.extraCategories?.includes(activeFilter);
      const textMatches = !query || `${entry.search} ${entry.title} ${entry.summary} ${entry.source}`.toLocaleLowerCase().includes(query);
      return categoryMatches && textMatches;
    });
    grid.replaceChildren(...entries.map(renderEntry));
    count.textContent = `${day.label} · 显示 ${entries.length} 条`;
    empty.hidden = entries.length > 0;
    window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });
  };

  const selectCategory = (tab) => {
    activeFilter = tab.dataset.filter;
    categoryTabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    results.setAttribute("aria-labelledby", tab.id);
    updateResults();
  };

  const selectDate = (date, focus = false) => {
    activeDate = date;
    const day = daysByDate.get(date);
    document.querySelectorAll("[data-timeline-date]").forEach((button) => {
      const selected = button.dataset.timelineDate === date;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    renderStats(day);
    renderTrend(day);
    updateResults();
  };

  categoryTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCategory(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % categoryTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + categoryTabs.length) % categoryTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = categoryTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectCategory(categoryTabs[next]);
      categoryTabs[next].focus();
    });
  });
  search.addEventListener("input", updateResults);

  fetch("timeline.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`timeline_${response.status}`);
      return response.json();
    })
    .then((data) => {
      days = Array.isArray(data.days) ? data.days : [];
      days.forEach((day) => daysByDate.set(day.date, day));
      if (!days.length) throw new Error("timeline_empty");
      activeDate = days[0].date;
      renderDateRail();
      selectDate(activeDate);
    })
    .catch(() => {
      count.textContent = "时间线暂时无法加载";
      error.hidden = false;
    });
})();
