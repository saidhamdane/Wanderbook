import puppeteer from 'puppeteer';

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:3002';
const ids = process.argv.slice(2);

if (ids.length === 0) {
  console.error('Usage: node scripts/qa-mobile-magazine.mjs <magazine-id> [magazine-id...]');
  process.exit(1);
}

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

let failed = false;

try {
  for (const id of ids) {
    const page = await browser.newPage();
    const messages = [];
    const resource404s = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('Failed to load resource')) messages.push(text);
    });
    page.on('pageerror', (err) => messages.push(err.message));
    page.on('response', (res) => {
      if (res.status() === 404) resource404s.push(res.url());
    });
    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });

    const url = `${baseUrl}/magazine/${encodeURIComponent(id)}`;
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('.flipbook-test-stage', { timeout: 10000 });
    let pagesVisited = 1;
    for (let i = 0; i < 7; i += 1) {
      const canGoNext = await page.$eval(
        '.flipbook-test-arrow[aria-label="Next page"]',
        (button) => !button.hasAttribute('disabled'),
      ).catch(() => false);
      if (!canGoNext) break;
      await page.click('.flipbook-test-arrow[aria-label="Next page"]');
      await new Promise((resolve) => setTimeout(resolve, 900));
      pagesVisited += 1;
    }
    const result = await page.evaluate(() => {
      const stage = document.querySelector('.flipbook-test-stage');
      const body = document.documentElement;
      const rect = stage?.getBoundingClientRect();
      return {
        stageWidth: rect ? Math.round(rect.width) : 0,
        scrollWidth: body.scrollWidth,
        viewportWidth: window.innerWidth,
        ready: !document.body.textContent?.includes('Preparing flipbook...'),
      };
    });

    const status = response?.status() ?? 0;
    const overflow = result.scrollWidth > result.viewportWidth + 1;
    const stageTooSmall = result.stageWidth < 350;
    const hasErrors = messages.length > 0;
    const didVisitFirstEight = pagesVisited >= 8;
    if (status !== 200 || overflow || stageTooSmall || hasErrors || !didVisitFirstEight) failed = true;

    console.log(JSON.stringify({
      id,
      url,
      status,
      stageWidth: result.stageWidth,
      overflow,
      ready: result.ready,
      pagesVisited,
      errors: messages.slice(0, 5),
      resource404s: resource404s.slice(0, 5),
    }));

    await page.close();
  }
} finally {
  await browser.close();
}

process.exit(failed ? 1 : 0);
