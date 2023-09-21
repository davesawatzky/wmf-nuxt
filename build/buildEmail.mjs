import { renderHtmlEmail } from '../server/utils/renderer'
// import data = require('../src/data/mockData.json')

const html = await renderHtml().catch((error) => console.log(error.message))
console.log(html)
