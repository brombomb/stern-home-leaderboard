const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrapeLoginForm() {
  const url = 'https://insider.sternpinball.com/login';
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const form = $('form');
  const action = form.attr('action');
  const method = form.attr('method') || 'POST';
  const inputs = {};
  form.find('input').each((i, el) => {
    const name = $(el).attr('name');
    const value = $(el).attr('value') || '';
    if (name) {
      inputs[name] = value;
    }
  });
  return { action, method, inputs };
}

module.exports = scrapeLoginForm;
