#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { detailsFor, frameworkFor } = require('./ai-tracking-schema.cjs')

const repoRoot = path.resolve(__dirname, '../..')
const timelineFlag = process.argv.indexOf('--timeline')
const timelineValue = timelineFlag === -1 ? null : process.argv[timelineFlag + 1]
const timelinePath = path.resolve(timelineValue || path.join(repoRoot, 'website/ai-tracking/timeline.json'))
const dryRun = process.argv.includes('--dry-run')
const data = JSON.parse(fs.readFileSync(timelinePath, 'utf8'))
let changed = 0

data.days.forEach((day) => day.entries.forEach((entry) => {
  if (!entry.framework) {
    entry.framework = frameworkFor(entry)
    changed += 1
  }
  if (!Array.isArray(entry.details) || entry.details.length === 0) {
    entry.details = detailsFor(entry)
    changed += 1
  }
}))

if (dryRun) {
  console.log(`AI tracking normalization would update ${changed} field group(s)`)
} else if (changed) {
  const temporaryPath = `${timelinePath}.tmp-${process.pid}`
  fs.writeFileSync(temporaryPath, `${JSON.stringify(data, null, 2)}\n`)
  fs.renameSync(temporaryPath, timelinePath)
  console.log(`AI tracking normalization updated ${changed} field group(s)`)
} else {
  console.log('AI tracking normalization found no changes')
}
