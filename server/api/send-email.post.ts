// server/api/send-email.post.ts
import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import { renderHtmlEmail } from '../utils/renderer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Body: ', body)
  const html = await renderHtmlEmail(body)

  console.log('HTML: ', html)

  // TODO: This needs to be removed when done.
  if (!!html) {
    fs.writeFile(
      path.join(process.cwd(), 'htmlEmail.html'),
      html,
      (err: any) => {
        if (err) {
          console.log(err)
        } else {
          console.log('File written successfully\n')
        }
      }
    )
  }

  // const transporter = nodemailer.createTransport({
  //   host: process.env.HOST || 'mail.davesawatzky.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'info@davesawatzky.com',
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // })

  // const options = {
  //   from: 'info@davesawatzky.com',
  //   to: 'david@diatonic.io',
  //   subject: 'Email Test',
  //   html: html,
  // }
  // await transporter.sendMail(options)
  return { message: 'Email sent' }
})
