require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Appoitment 👻" <huylmht10@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "THÔNG TIN ĐẶT LỊCH KHÁM BỆNH ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt online trên web BookingCare!/</p>
            <p>Thông tin đặt lịch khám bệnh</p>
            <div>
                <b>Thời gian: ${dataSend.time}</b><br/>
                <b>Bác sĩ: ${dataSend.doctorName}</b>
            </div>
            <p>Nếu các thông tin là đúng sự thật vui lòng click vào đường link bên dưới để xác nhận và hoàn
            tất thủ tục đặt lịch khám bệnh.</p>
            <div>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>
            <div>Xin chân thành cảm ơn đã tin tưởng và sử dụng trang web của chúng tôi!</div>
        `, // html body
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}