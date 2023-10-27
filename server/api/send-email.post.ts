// server/api/send-email.post.ts
import nodemailer from 'nodemailer'
import { access, constants } from 'node:fs'
import fs from 'node:fs/promises'
import { renderSubmissionEmail } from '../utils/submissionEmail'

export default defineEventHandler(async (payload) => {
  const body = await readBody(payload)
  const html = await renderSubmissionEmail(body)
  const userFirstName = body.userFirstName
  const userLastName = body.userLastName
  const userEmail = body.userEmail
  const confirmation = body.registration.confirmation
  const config = useRuntimeConfig()

  // TODO: This needs to be removed when done.
  // if (!!html) {
  //   try {
  //     const fileURL = new URL(
  //       `./emails/registrations/${userLastName}_${confirmation}.html`,
  //       import.meta.url
  //     )
  //     await fs.writeFile(fileURL, html)
  //     console.log('File written successfully\n')
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const transporter = nodemailer.createTransport({
    host: config.sendingEmailServer,
    port: Number(config.sendingSmtpPort),
    secure: true,
    auth: {
      user: config.emailServerUserAccount,
      pass: config.sendingEmailPassword,
    },
  })

  const options = {
    from: config.sendingEmailAddress,
    to: userEmail,
    bcc: config.bccEmailAddress,
    subject: `WMFestival Registration - ${confirmation}`,
    html: html,
  }
  await transporter.sendMail(options)
  return { message: 'Email sent' }
})
