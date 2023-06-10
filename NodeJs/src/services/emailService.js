require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });


    let info = await transporter.sendMail({
        from: '"Booking Appoitment 👻" <huylmht10@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "THÔNG TIN ĐẶT LỊCH KHÁM BỆNH ✔",
        html: getBodyHtmlEmail(dataSend),
    });
}

let getBodyHtmlEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You received this email because you booked online on the BookingCare website!/</p>
            <p>Information to book a medical appointment</p>
            <div>
                <b>Time: ${dataSend.time}</b><br/>
                <b>Doctor: ${dataSend.doctorName}</b>
            </div>
            <p>If the information is true, please click on the link below to confirm and complete the procedure to book an appointment.</p>
            <div>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>
            <div>Thank you very much for trusting and using our website!</div>
            `
    }
    if (dataSend.language === 'vi') {
        result =
            `
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
                <a href=${dataSend.redirectLink} target="_blank">Click vào đây!</a>
            </div>
            <div>Xin chân thành cảm ơn đã tin tưởng và sử dụng trang web của chúng tôi!</div>
            `
    }
    return result;
}


let getBodyHtmlEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You received this email because you booked online on the BookingCare website!/</p>
            <p>Information to book a medical appointment</p>
            <p>VVVV</p>
            <div>Thank you very much for trusting and using our website!</div>
            `
    }
    if (dataSend.language === 'vi') {
        result =
            `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt online trên web BookingCare thành công!/</p>
            <p>Thông tin đặt lịch khám bệnh</p>
            <p>Thông tin đơn thuốc / hóa đơn được gửi trong file đính kèm</p>
            <div>Xin chân thành cảm ơn đã tin tưởng và sử dụng trang web của chúng tôi!</div>
            `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });


            let info = await transporter.sendMail({
                from: '"Booking Appoitment 👻" <huylmht10@gmail.com>',
                to: dataSend.email,
                subject: "KẾT QUẢ ĐẶT LỊCH KHÁM BỆNH ✔",

                html: getBodyHtmlEmailRemedy(dataSend),
                attachments: [

                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve(true)
        } catch (e) {
            reject(e);
        }
    })
    return result;
}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}