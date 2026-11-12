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

  const frameworkFor = (entry) => {
    if (entry.framework) return entry.framework;
    if (entry.category === "industry") return "STAR";
    if (entry.category === "papers") return "论文五问";
    if (entry.category === "coding" || entry.extraCategories?.includes("coding")) return "SMART";
    return "5W2H";
  };

  const fallbackDetails = (entry) => {
    if (frameworkFor(entry) === "STAR") {
      return [
        { label: "场景", value: `${entry.source} 的案例：${entry.title}。` },
        { label: "任务", value: "需要把模型能力放进真实业务流程，并控制权限、失败恢复和人工接管。" },
        { label: "行动", value: entry.summary },
        { label: "结果", value: "当前来源提供了事件或试点信息，但没有足够的独立对照数据来外推规模化效果。" },
        { label: "边界", value: "请以原始来源的阶段、样本和限制为准，不把演示或单一案例当成行业结论。" },
        { label: "可复用做法", value: "先选可回滚的小范围流程，记录成功率、延迟、人工介入和异常类型，再决定是否扩大。" }
      ];
    }
    if (frameworkFor(entry) === "论文五问") {
      return [
        { label: "研究问题", value: `论文试图回答：${entry.title} 所对应的具体问题是什么？` },
        { label: "方法", value: entry.summary },
        { label: "结果", value: "结果来自论文作者报告的测试设置；比较时要同时看基线、样本量和评测条件。" },
        { label: "边界", value: "这是预印本，不能把作者报告的结果当成已被独立复现的普遍规律。" },
        { label: "应用", value: "先在自己的历史数据或回归任务上复测一个最小版本，确认收益是否覆盖新增复杂度。" }
      ];
    }
    if (frameworkFor(entry) === "SMART") {
      return [
        { label: "目标", value: entry.title },
        { label: "指标", value: entry.summary },
        { label: "范围", value: `先在与 ${entry.source} 相同类型的任务上验证，保留人工审查和回滚入口。` },
        { label: "时限", value: "用一轮固定任务集完成首轮比较，再决定是否扩展到更多仓库或工作流。" },
        { label: "验收", value: "同时检查功能通过率、返工时间、权限违规和总成本，不只看生成速度。" }
      ];
    }
    return [
      { label: "发生了什么", value: entry.summary },
      { label: "谁 / 面向谁", value: `${entry.source}，主要影响与该条目同类的开发者、产品或业务团队。` },
      { label: "何时与阶段", value: `来源日期为 ${entry.date}；当前条目按其页面标注的发布、预览或研究阶段理解。` },
      { label: "为什么重要", value: "它提供了一个可观察的能力或产品变化，但影响仍取决于可用范围、稳定性和实际使用成本。" },
      { label: "证据边界", value: "详情以原始来源为准；厂商演示、预印本和单一案例不能替代独立验证。" },
      { label: "下一步", value: "围绕自己的任务做一次小范围、可回滚的验证，并记录效果、失败和人工介入。" }
    ];
  };

  const renderDetails = (entry) => {
    const details = document.createElement("details");
    details.className = "signal-details";
    const toggle = document.createElement("summary");
    toggle.append(text("展开详细分析"), icon("chevron-down"));
    const framework = document.createElement("p");
    framework.className = "signal-framework";
    framework.append(text("展示框架："));
    const frameworkName = document.createElement("strong");
    frameworkName.textContent = entry.frameworkLabel || frameworkFor(entry);
    framework.append(frameworkName);
    const list = document.createElement("dl");
    list.className = "signal-detail-list";
    (entry.details || fallbackDetails(entry)).forEach((item) => {
      const row = document.createElement("div");
      row.className = "signal-detail-row";
      const label = document.createElement("dt");
      label.textContent = item.label;
      const value = document.createElement("dd");
      value.textContent = item.value;
      row.append(label, value);
      list.append(row);
    });
    details.append(toggle, framework, list);
    return details;
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
    const summaryText = document.createElement("p");
    summaryText.textContent = entry.summary;
    article.append(meta, heading, summaryText, renderDetails(entry), link(entry));
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
