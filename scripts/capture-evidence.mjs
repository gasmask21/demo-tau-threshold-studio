import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('artifacts')
await mkdir(OUT, { recursive: true })

async function setTau(page, value) {
  await page.$eval(
    '#tau-slider',
    (el, v) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      ).set
      setter.call(el, String(v))
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    },
    value,
  )
  await page.waitForTimeout(250)
}

async function outcomes(page) {
  return page.$$eval('.step-card', (cards) =>
    cards.map((c) => ({
      id: c.getAttribute('data-step'),
      o: c.getAttribute('data-outcome'),
      conf: c.getAttribute('data-confidence'),
    })),
  )
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.waitForSelector('[data-testid=tau-slider]')

// Fixed 0.5 → high risk
await page.click('[data-testid=preset-fixed]')
await page.waitForSelector('[data-testid=badge-high-risk]')
const tauFixed = await page.textContent('[data-testid=tau-value]')
console.log('fixed tau display:', tauFixed)
await page.screenshot({
  path: path.join(OUT, 'preset-fixed-high-risk.png'),
  fullPage: true,
})

// Mid τ mixed coloring
await setTau(page, 0.75)
const mid = await outcomes(page)
const midTau = await page.textContent('[data-testid=tau-value]')
console.log('mid tau:', midTau, mid.map((x) => `${x.id}:${x.o}`).join(' '))
await page.screenshot({
  path: path.join(OUT, 'slider-accept-defer.png'),
  fullPage: true,
})

// Flips 0.5 → 1.0
await setTau(page, 0.5)
const at05 = await outcomes(page)
await setTau(page, 1.0)
const at10 = await outcomes(page)
const flips = at05.filter((s, i) => s.o === 'accept' && at10[i].o === 'defer').length
console.log('flips accept→defer 0.5→1.0:', flips)
if (flips < 2) {
  console.error('at05', at05)
  console.error('at10', at10)
  throw new Error(`FAIL: expected ≥2 flips, got ${flips}`)
}

// Fit from shadow
await page.click('[data-testid=fit-shadow]')
await page.waitForSelector('[data-testid=fitted-tau]')
await page.waitForSelector('[data-testid=badge-low-risk]')
const fittedText = await page.textContent('[data-testid=fitted-tau]')
console.log('fitted:', fittedText)
const m = fittedText.match(/([\d.]+)/)
const fittedVal = m ? Number(m[1]) : 0
if (fittedVal < 0.95) throw new Error(`FAIL: fitted τ ${fittedVal} < 0.95`)

await page.screenshot({
  path: path.join(OUT, 'fitted-low-risk.png'),
  fullPage: true,
})

console.log('PASS all acceptance checks')
await browser.close()
