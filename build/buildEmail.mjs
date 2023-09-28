import { renderSubmissionEmail } from '../server/utils/submissionEmail'
// import data = require('../src/data/mockData.json')

const html = await renderSubmissionEmail().catch((error) =>
  console.log(error.message)
)
console.log(html)
