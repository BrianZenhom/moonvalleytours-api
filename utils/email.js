import nodemailer from 'nodemailer'
import pug from 'pug'
import { convert } from 'html-to-text'
import path from 'path'
import { fileURLToPath } from 'url'

// new Email(user, url).sendWelcome()

export default class Email {
  constructor (user, url) {
    this.to = user.email
    this.firstName = user.name
    this.url = url
    this.from = `Moon Valley Tours <${process.env.NOREPLYEMAIL}>`
  }

  newTransport () {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.DELIVERY_HOST,
        port: process.env.DELIVERY_PORT,
        secure: false,
        auth: {
          user: process.env.DELIVERY_USER,
          pass: process.env.DELIVERY_PASS
        }
      })
    }

    return nodemailer.createTransport({
      host: process.env.NOREPLYHOST,
      port: process.env.NOREPLYPORT,
      auth: {
        user: process.env.NOREPLYEMAIL,
        pass: process.env.NOREPLYPW
      }
    })
  }

  async send (template, subject) {
    // 1 render html based on a pug template
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })

    // 2 define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: false
      })
    }

    // 3 create a transport and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome () {
    await this.send('welcome', 'Welcome to Moon Valley Tours!')
  }

  async sendPasswordReset () {
    await this.send('passwordReset', 'Reset the password of your account in Moon Valley Tours')
  }
}
