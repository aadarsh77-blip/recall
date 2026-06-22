const fetch = require('node-fetch');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

async function test() {
  try {
    const res = await fetch('https://github.com/sudo-aadarsh?tab=repositories', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, nav, footer, header, iframe').remove();
    
    const bodyHtml = $('body').html() || '';
    
    const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    const markdownText = turndownService.turndown(bodyHtml);
    
    console.log("SUCCESS. Length:", markdownText.length);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
