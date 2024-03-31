// server/api/send-email.post.ts
import nodemailer from 'nodemailer'
import { renderSubmissionEmail } from '../utils/submissionEmail'

const config = useRuntimeConfig()

export default defineEventHandler(async (payload) => {
  const body = await readBody(payload)
  const userEmail = body.userEmail
  const confirmation = body.registration.confirmation
  const html = await renderSubmissionEmail(body)

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
    html,
  }

  const info = await transporter
    .sendMail(options)
    .catch(error => console.log(error))

  return { message: 'Email sent from send-email.post.ts' }
})
