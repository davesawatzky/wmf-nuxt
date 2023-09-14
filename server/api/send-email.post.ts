// server/api/send-email.post.ts
import nodemailer from 'nodemailer'
import { useCompiler } from '#vue-email'

let template: any

export default defineEventHandler(async (event) => {
  try {
    template = await useCompiler('summaryEmail.vue')
    console.log('Template: ', template)
    if (!template) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.HOST || 'mail.davesawatzky.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@davesawatzky.com',
        pass: 'MGs$)W6n(3O;',
      },
    })

    const options = {
      from: 'info@davesawatzky.com',
      to: 'dave.sawatzky@gmail.com',
      subject: 'Email Test',
      html: template,
    }
    await transporter.sendMail(options)
    return { message: 'Email sent' }
  } catch (error) {
    console.error(error)
    console.log(template)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
