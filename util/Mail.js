const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MDP
    },
    tls: {
        rejectUnauthorized: false
    }
});

const SendMail = async function SendMail(AdressEmail, sujet, Message) {
    let messageAddSignature = Message + signature
    console.log(process.env.MDP)
    console.log(process.env.EMAIL)
    transporter.sendMail({
        from: "univ@gg",
        to: AdressEmail,
        subject: sujet,
        text: messageAddSignature
    }, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

const signature = `
    \n\n\n--------------------------------------
    Cordialement,

    L'équipe de Gestion des Assignments
  `;


module.exports = {
    SendMail
}