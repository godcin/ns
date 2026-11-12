#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { isDate, isHttpUrl, validateTimeline } = require('./ai-tracking-schema.cjs')

const repoRoot = path.resolve(__dirname, '../..')
const defaultTimeline = path.join(repoRoot, 'website/ai-tracking/timeline.json')
const defaultScript = path.join(repoRoot, 'website/ai-tracking/tracking.js')

function flagValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? null : process.argv[index + 1]
}

function readJson(filePath, label, errors) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    errors.push(`${label}: ${error.message}`)
    return null
  }
}

function dateOffset(date, offset) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + offset)
  return value.toISOString().slice(0, 10)
}

function validateReports(reportsDir, latestTimelineDate, errors) {
  if (!reportsDir) return
  const reportFiles = fs.readdirSync(reportsDir).filter((file) => /^\d{4}-\d{2}-\d{2}\.md$/.test(file)).sort()
  if (reportFiles.length === 0) {
    errors.push(`reports directory has no dated reports: ${reportsDir}`)
    return
  }
  const latestReportDate = reportFiles.at(-1).slice(0, 10)
  if (latestReportDate !== latestTimelineDate) errors.push(`latest report ${latestReportDate} does not match timeline ${latestTimelineDate}`)
  const latestReport = fs.readFileSync(path.join(reportsDir, reportFiles.at(-1)), 'utf8')
  const cutoff = latestReport.match(/内容截止时间：\*\*\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})（Asia\/Shanghai）/)
  if (!cutoff) errors.push(`latest report ${reportFiles.at(-1)} is missing a content cutoff`) 
  else {
    const expectedDate = dateOffset(latestReportDate, -1)
    if (cutoff[1] !== expectedDate || cutoff[2] !== '23:59:59') errors.push(`latest report cutoff must be ${expectedDate} 23:59:59, got ${cutoff[1]} ${cutoff[2]}`)
  }
  const statePath = path.join(reportsDir, '.state.json')
  if (!fs.existsSync(statePath)) {
    errors.push(`missing report state: ${statePath}`)
    return
  }
  const state = readJson(statePath, '.state.json', errors)
  if (!state) return
  const expectedCheckpoint = `${dateOffset(latestReportDate, -1)}T23:59:59+08:00`
  if (state.last_successful_run !== expectedCheckpoint) errors.push(`.state.json last_successful_run must be ${expectedCheckpoint}`)
  if (state.last_generated_at && !state.last_generated_at.startsWith(`${latestReportDate}T`)) errors.push(`.state.json last_generated_at must be on ${latestReportDate}`)
  if (!Array.isArray(state.retry_queue)) errors.push('.state.json retry_queue must be an array')
  else state.retry_queue.forEach((item, index) => {
    ;['event_key', 'canonical_url', 'failure_reason', 'attempt_count', 'next_attempt_date', 'report_path'].forEach((field) => {
      if (item[field] === undefined || item[field] === '') errors.push(`retry_queue[${index}].${field} is required`)
    })
    if (item.canonical_url && !isHttpUrl(item.canonical_url)) errors.push(`retry_queue[${index}].canonical_url must be an http(s) URL`)
    if (item.next_attempt_date && !isDate(item.next_attempt_date)) errors.push(`retry_queue[${index}].next_attempt_date is invalid`)
  })
}

const errors = []
const warnings = []
const timelinePath = path.resolve(flagValue('--timeline') || defaultTimeline)
const scriptPath = path.resolve(flagValue('--script') || defaultScript)
const reportsDirValue = flagValue('--reports-dir') || process.env.AI_DAILY_REPORTS_DIR
const reportsDir = reportsDirValue ? path.resolve(reportsDirValue) : null
const strictDetails = process.argv.includes('--strict-details')

if (!fs.existsSync(timelinePath)) errors.push(`missing timeline: ${timelinePath}`)
const timeline = fs.existsSync(timelinePath) ? readJson(timelinePath, 'timeline.json', errors) : null
if (timeline) {
  const result = validateTimeline(timeline, { strictDetails })
  errors.push(...result.errors)
  warnings.push(...result.warnings)
  if (timeline.days?.[0]?.date) validateReports(reportsDir, timeline.days[0].date, errors)
}

if (!fs.existsSync(scriptPath)) errors.push(`missing tracking script: ${scriptPath}`)
else {
  const syntax = spawnSync(process.execPath, ['--check', scriptPath], { encoding: 'utf8' })
  if (syntax.status !== 0) errors.push(`tracking.js syntax error: ${syntax.stderr.trim()}`)
}

warnings.forEach((warning) => console.warn(`WARN ${warning}`))
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`))
  console.error(`AI tracking validation failed with ${errors.length} error(s)`)
  process.exitCode = 1
} else {
  const detailMode = strictDetails ? 'strict details' : 'legacy detail fallback allowed'
  console.log(`AI tracking validation passed (${timeline.days.length} day(s), ${detailMode})`)
}
