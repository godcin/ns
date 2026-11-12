const ENTRY_CATEGORIES = new Set(['updates', 'industry', 'papers', 'coding'])
const FRAMEWORKS = new Set(['5W2H', 'STAR', '论文五问', 'SMART'])
const REQUIRED_ENTRY_FIELDS = ['category', 'source', 'date', 'title', 'summary', 'url', 'linkLabel', 'search']

function frameworkFor(entry) {
  if (entry.framework) return entry.framework
  if (entry.category === 'industry') return 'STAR'
  if (entry.category === 'papers') return '论文五问'
  if (entry.category === 'coding' || entry.extraCategories?.includes('coding')) return 'SMART'
  return '5W2H'
}

function detailsFor(entry) {
  const framework = frameworkFor(entry)
  if (framework === 'STAR') {
    return [
      { label: '场景', value: `${entry.source} 的案例：${entry.title}。` },
      { label: '任务', value: '需要把模型能力放进真实业务流程，并控制权限、失败恢复和人工接管。' },
      { label: '行动', value: entry.summary },
      { label: '结果', value: '当前来源提供了事件或试点信息，但没有足够的独立对照数据来外推规模化效果。' },
      { label: '边界', value: '请以原始来源的阶段、样本和限制为准，不把演示或单一案例当成行业结论。' },
      { label: '可复用做法', value: '先选可回滚的小范围流程，记录成功率、延迟、人工介入和异常类型，再决定是否扩大。' },
    ]
  }
  if (framework === '论文五问') {
    return [
      { label: '研究问题', value: `论文试图回答：${entry.title} 所对应的具体问题是什么？` },
      { label: '方法', value: entry.summary },
      { label: '结果', value: '结果来自论文作者报告的测试设置；比较时要同时看基线、样本量和评测条件。' },
      { label: '边界', value: '这是预印本，不能把作者报告的结果当成已被独立复现的普遍规律。' },
      { label: '应用', value: '先在自己的历史数据或回归任务上复测一个最小版本，确认收益是否覆盖新增复杂度。' },
    ]
  }
  if (framework === 'SMART') {
    return [
      { label: '目标', value: entry.title },
      { label: '指标', value: entry.summary },
      { label: '范围', value: `先在与 ${entry.source} 相同类型的任务上验证，保留人工审查和回滚入口。` },
      { label: '时限', value: '用一轮固定任务集完成首轮比较，再决定是否扩展到更多仓库或工作流。' },
      { label: '验收', value: '同时检查功能通过率、返工时间、权限违规和总成本，不只看生成速度。' },
    ]
  }
  return [
    { label: '发生了什么', value: entry.summary },
    { label: '谁 / 面向谁', value: `${entry.source}，主要影响与该条目同类的开发者、产品或业务团队。` },
    { label: '何时与阶段', value: `来源日期为 ${entry.date}；当前条目按其页面标注的发布、预览或研究阶段理解。` },
    { label: '为什么重要', value: '它提供了一个可观察的能力或产品变化，但影响仍取决于可用范围、稳定性和实际使用成本。' },
    { label: '证据边界', value: '详情以原始来源为准；厂商演示、预印本和单一案例不能替代独立验证。' },
    { label: '下一步', value: '围绕自己的任务做一次小范围、可回滚的验证，并记录效果、失败和人工介入。' },
  ]
}

function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\/[^\s]+$/.test(value) && !/[<>"']/.test(value)
}

function validateTimeline(data, { strictDetails = false } = {}) {
  const errors = []
  const warnings = []
  if (!data || typeof data !== 'object') return { errors: ['timeline must be an object'], warnings }
  if (data.version !== 1) errors.push('timeline.version must be 1')
  if (!Array.isArray(data.days) || data.days.length === 0) {
    errors.push('timeline.days must be a non-empty array')
    return { errors, warnings }
  }

  const seenDates = new Set()
  data.days.forEach((day, index) => {
    const prefix = `days[${index}]`
    if (!isDate(day.date)) errors.push(`${prefix}.date is not YYYY-MM-DD`)
    if (seenDates.has(day.date)) errors.push(`${prefix}.date is duplicated: ${day.date}`)
    seenDates.add(day.date)
    if (index > 0 && day.date >= data.days[index - 1].date) errors.push(`days must be newest first: ${day.date}`)
    if (typeof day.generatedAt !== 'string' || Number.isNaN(Date.parse(day.generatedAt))) errors.push(`${prefix}.generatedAt is invalid`)
    if (!Array.isArray(day.entries)) {
      errors.push(`${prefix}.entries must be an array`)
      return
    }
    const counts = { updates: 0, industry: 0, papers: 0, coding: 0 }
    let missingDetails = 0
    day.entries.forEach((entry, entryIndex) => {
      const entryPrefix = `${prefix}.entries[${entryIndex}]`
      REQUIRED_ENTRY_FIELDS.forEach((field) => {
        if (typeof entry[field] !== 'string' || entry[field].trim() === '') errors.push(`${entryPrefix}.${field} is required`)
      })
      if (!ENTRY_CATEGORIES.has(entry.category)) errors.push(`${entryPrefix}.category is unknown: ${entry.category}`)
      else counts[entry.category] += 1
      if (!isDate(entry.date)) errors.push(`${entryPrefix}.date is invalid`)
      if (!isHttpUrl(entry.url)) errors.push(`${entryPrefix}.url must be an http(s) URL`)
      if (entry.url?.includes('&amp;')) errors.push(`${entryPrefix}.url contains HTML escaping: ${entry.url}`)
      const framework = frameworkFor(entry)
      if (!FRAMEWORKS.has(framework)) errors.push(`${entryPrefix}.framework is unknown: ${framework}`)
      if (!Array.isArray(entry.details) || entry.details.length === 0) {
        missingDetails += 1
        if (strictDetails) errors.push(`${entryPrefix}.details is missing`)
      } else {
        entry.details.forEach((detail, detailIndex) => {
          if (!detail || typeof detail.label !== 'string' || detail.label.trim() === '' || typeof detail.value !== 'string' || detail.value.trim() === '') {
            errors.push(`${entryPrefix}.details[${detailIndex}] needs label and value`)
          }
        })
      }
    })
    if (missingDetails && !strictDetails) warnings.push(`${prefix} has ${missingDetails} entry(ies) without details; runtime fallback will be used`)
    if (!day.stats || typeof day.stats !== 'object') errors.push(`${prefix}.stats is required`)
    else {
      ;['updates', 'industry', 'papers'].forEach((category) => {
        if (day.stats[category] !== counts[category]) errors.push(`${prefix}.stats.${category}=${day.stats[category]} but entries have ${counts[category]}`)
      })
      const trendCount = day.trend ? 1 : 0
      if (day.stats.trends !== trendCount) errors.push(`${prefix}.stats.trends=${day.stats.trends} but trend data is ${trendCount ? 'present' : 'absent'}`)
    }
  })
  return { errors, warnings }
}

module.exports = { ENTRY_CATEGORIES, FRAMEWORKS, REQUIRED_ENTRY_FIELDS, detailsFor, frameworkFor, isDate, isHttpUrl, validateTimeline }
