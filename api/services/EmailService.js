import Nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = Nodemailer.createTransport({
      // host: process.env.HOST_MAIL,
      // port: process.env.PORT_MAIL,
      // secure: false,
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.PASSWORD_USER,
      },
    });
  }
  sendIntitation(invitation, client) {
    const { fullname, email, webToken } = invitation;
    const mailOptions = {
      from: process.env.FROM_MAIL,
      to: email,
      subject: 'Invitación a Bunkey',
      html: `<p>Hola ${fullname}, nuestro cliente ${client.name} te ha invitado a formar parte de su grupo de trabajo.</p>
      <p>Has click <a href="${TokenService.generateWebURL('invitation', webToken)}">aquí</a> para aceptar.</p>`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          cano.log.error(error);
          reject(error);
          return;
        }
        resolve(info);
      });
    });
  }
  sendNewPassword({ to, subject = 'Solicitud de nueva contraseña', name, password }) {
    const mailOptions = {
      from: process.env.FROM_MAIL,
      to,
      subject,
      html: `<p>Hola ${name}, esta es tu nueva contraseña: <b>${password}</b></p>`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            cano.log.error(error);
            reject(error);
            return;
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        resolve(info);
      });
    });
  }
}

export default EmailService;
