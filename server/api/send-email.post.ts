// server/api/send-email.post.ts
import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import { renderSubmissionEmail } from '../utils/submissionEmail'

export default defineEventHandler(async (payload) => {
  const body = await readBody(payload)
  const html = await renderSubmissionEmail(body)
  const userFirstName = body.userFirstName
  const userLastName = body.userLastName
  const userEmail = body.userEmail
  const confirmation = body.registration.confirmation
  console.log('userFirstName: ', userFirstName)
  console.log('userLastName: ', userLastName)
  console.log('userEmail: ', userEmail)

  // TODO: This needs to be removed when done.
  // if (!!html) {
  //   fs.writeFile(
  //     path.join(process.cwd(), 'htmlEmail.html'),
  //     html,
  //     (err: any) => {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         console.log('File written successfully\n')
  //       }
  //     }
  //   )
  // }

  const transporter = nodemailer.createTransport({
    host: process.env.SENDING_EMAIL_SERVER || 'mail.davesawatzky.com',
    port: process.env.SENDING_SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER_ACCOUNT || 'info@davesawatzky.com',
      pass: process.env.SENDING_EMAIL_PASSWORD,
    },
  })

  const options = {
    from: process.env.SENDING_EMAIL_ADDRESS || 'info@davesawatzky.com',
    to: userEmail,
    bcc: 'info@exaudi.ca',
    subject: `WMFestival Registration - ${confirmation}`,
    text: 'Testing out the text portion of the email',
    html: html,
  }
  await transporter.sendMail(options)
  return { message: 'Email sent' }
})
