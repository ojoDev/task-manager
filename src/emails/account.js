const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ojopoderoso@gmail.com',
    subject: 'Welcome to hell',
    text: `Welcome to the app ${name}.`,
    html: `Welcome to the app ${name}.`
})
.catch((error) => {
  console.error(error)
})}

const cancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ojopoderoso@gmail.com',
    subject: 'Bye bye',
    text: `You kicked off the app, ${name}. Why the matter? It's incredible!`
})
.catch((error) => {
  console.error(error)
})}


module.exports = {
  sendWelcomeEmail,
  cancelationEmail
}