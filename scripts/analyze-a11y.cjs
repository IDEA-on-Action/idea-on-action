const fs = require('fs');

// Get latest LHR file
const files = fs.readdirSync('.lighthouseci')
  .filter(f => f.startsWith('lhr-') && f.endsWith('.json'))
  .sort().reverse();
const latestFile = '.lighthouseci/' + files[0];
console.log('Analyzing:', latestFile, '\n');

const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

const issues = [
  'aria-progressbar-name',
  'aria-required-children',
  'button-name',
  'color-contrast',
  'heading-order',
  'label-content-name-mismatch',
  'link-text'
];

issues.forEach((id) => {
  const audit = data.audits[id];
  if (audit && audit.details && audit.details.items && audit.details.items.length > 0) {
    console.log(`\n=== ${audit.title} ===`);
    console.log(`Score: ${audit.score}`);
    console.log(`Items: ${audit.details.items.length}`);
    audit.details.items.slice(0, 5).forEach((item, i) => {
      console.log(`\n${i + 1}.`);
      if (item.node) {
        console.log(`  Selector: ${item.node.selector || 'N/A'}`);
        console.log(`  Snippet: ${item.node.snippet || 'N/A'}`);
      }
      if (item.relatedNodes) {
        console.log(`  Related Nodes: ${item.relatedNodes.length}`);
      }
    });
  }
});
