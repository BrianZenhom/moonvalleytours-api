import nodemailer from 'nodemailer'

const sendEmail = async options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NOREPLYHOST,
    port: process.env.NOREPLYPORT,
    auth: {
      user: process.env.NOREPLYEMAIL,
      pass: process.env.NOREPLYPW
    }
  })
  // Define the email options
  const mailOptions = {
    from: `Moon Valley Tours ${process.env.NOREPLYEMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  }

  // Actually send the email
  await transporter.sendMail(mailOptions)
}

export default sendEmail
