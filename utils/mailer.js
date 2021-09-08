const nodemailer = require("nodemailer");

module.exports = {
    sendPass: async (email, newpass) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
            },
        });

        //url app user
        let url = "https://todo-list-api0.herokuapp.com/";

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Aware store" <awarestore@gmail.com>', // sender address
            to: email, // list of receivers
            text: "Reset Password", // plain text body
            subject: "Reset Password for Aware store account", // Subject line
            html: `Hi, ${email}<br/><br/><b>Your new password is ${newpass}</b><br/><br/>Please change this password after Logged in successfully in <a href="${url}">here</a>.<br/><br/><i>Please do not reply to this email. The mailbox that generated this email is not monitored for replies.<i>`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    },
    sendOrderToCutomer: async (email, orderId) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Aware store" <awarestore@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Aware store received your order", // Subject line
            html: `<center><h1>Thanks for your order #${orderId}</h1></center><h2>Hello, ${email}<br/>Your order has been received and is being processed.</h2>`, // html body
        });
    },
    sendOrderToAdmin: async (orderId) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Aware store" <awarestore@gmail.com>', // sender address
            to: "liemhoanglong@gmail.com", // list of receivers
            subject: "New order", // Subject line
            html: `<center><h1>You have a new order #${orderId}</h1></center><h2>Hello, admin<br/>Please check your order list now!</h2>`, // html body
        });
    },
    sendOrderStatusToCutomer: async (email, orderId, status) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Aware store" <awarestore@gmail.com>', // sender address
            to: email, // list of receivers
            subject: `${status}`, // Subject line
            html: `<center><h1>You have a order #${orderId}</h1></center><h2>Hello, ${email}<br/>${status}!</h2>`, // html body
        });
    }
}