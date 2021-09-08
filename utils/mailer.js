const nodemailer = require("nodemailer");

module.exports = {
    sendPass: async (email, newpass) => {
        // let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.com',
            port: 587,
            service: 'gmail',
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
                // user: testAccount.user, // generated ethereal user
                // pass: testAccount.pass, // generated ethereal password
            },
        });

        //url app user
        let url = "https://todo-list-api0.herokuapp.com/";

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Aware store" <awarestore@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Reset Password for Aware store account", // Subject line
            text: "You can reset your email!", // plain text body
            html: `Hi, ${email}<br/><br/><b>Your new password is ${newpass}</b><br/><br/>Please change this password after Logged in successfully in <a href="${url}">here</a>.<br/><br/><i>Please do not reply to this email. The mailbox that generated this email is not monitored for replies.<i>`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}