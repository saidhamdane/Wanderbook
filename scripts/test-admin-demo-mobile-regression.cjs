const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const sources = {
  demoPage: read('app/private/demo/[id]/page.tsx'),
  realMagazinePage: read('app/magazine/[id]/page.tsx'),
  viewer: read('components/magazine/InteractiveFlipbookViewer.tsx'),
  toolbar: read('components/magazine/AdminDemoToolbar.tsx'),
  badge: read('components/magazine/PdfLockedBadge.tsx'),
};

const tests = [
  {
    name: 'demo viewer mobile wrapper uses responsive width and hidden overflow',
    pass:
      sources.viewer.includes('width: 100%') &&
      sources.viewer.includes('max-width') &&
      sources.viewer.includes('overflow-x: hidden'),
  },
  {
    name: 'demo page uses InteractiveFlipbookViewer instead of MagazineRenderer',
    pass:
      sources.demoPage.includes('InteractiveFlipbookViewer') &&
      !sources.demoPage.includes('MagazineRenderer'),
  },
  {
    name: 'demo page has no active PDF or share actions',
    pass:
      !sources.demoPage.includes('DownloadPdfButton') &&
      !sources.demoPage.includes('ShareMagazineButton'),
  },
  {
    name: 'demo page includes PDF locked info',
    pass:
      sources.demoPage.includes('PdfLockedBadge') &&
      sources.badge.includes('PDF available after activating partner account') &&
      sources.badge.includes('PDF disponible al activar la cuenta del partner'),
  },
  {
    name: 'real magazine still exposes real PDF and share actions',
    pass:
      sources.realMagazinePage.includes('DownloadPdfButton') &&
      sources.realMagazinePage.includes('ShareMagazineButton'),
  },
  {
    name: 'demo toolbar includes Back to CRM',
    pass: sources.toolbar.includes('/private/leads') && sources.toolbar.includes('Back to CRM'),
  },
  {
    name: 'PDF locked badge is not an active button or link',
    pass:
      !sources.badge.includes('<button') &&
      !sources.badge.includes('<a ') &&
      !sources.badge.includes('onClick'),
  },
  {
    name: 'demo main prevents horizontal overflow',
    pass: sources.demoPage.includes('overflowX') && sources.demoPage.includes("'hidden'"),
  },
];

let failed = 0;

for (const test of tests) {
  if (test.pass) {
    console.log(`PASS ${test.name}`);
  } else {
    failed += 1;
    console.error(`FAIL ${test.name}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
