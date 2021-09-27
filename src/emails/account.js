const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'julianamaria304@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the task manager ${name}. Let me know how get along with the app.`
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'julianamaria304@gmail.com',
        subject: '¡Good bye!',
        text: `Could we have done something to keep you with us ${name}?. Let us know and we hope see you soon!`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}


