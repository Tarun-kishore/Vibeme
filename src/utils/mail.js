const nodemailer = require('nodemailer');


const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`
    }
});

const sendConfirmationMail = (link, email) => {
    const mailDetails = {
        from: 'Vibeme',
        to: `${email}`,
        subject: 'Confirmation Mail',
        text: 'Thanks for joining Vibeme',
        html: `<div
        style="@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap'); margin: 0; background-color: #b8dfff; overflow: hidden;">
        <div
            style="background-image: url(https://i.ibb.co/WWvmk18/title.png); margin: 30px auto 30px auto; background-size: contain; width: 50px; height: 50px; background-repeat: no-repeat;">
        </div>
        <div style="background-color: white; margin: 0 auto 3% auto; width: 571px; height:667px; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1) ;">
            <div
                style="width: 100%; background-image: url(https://i.ibb.co/74PFPCX/1.png); height: 300px; background-repeat: no-repeat; object-fit: cover;">
            </div>
            <div style="text-align: center; margin-top: 50px; margin-bottom: 30px;">
                <h1
                    style="font-family: 'Roboto Condensed', sans-serif; text-align: center; width: 100%; font-size: 28px; color: #515365;">
                    Verify Your
                    Email Address 
                </h1>
                <p
                    style="font-family: 'Ubuntu', sans-serif; font-weight: 400; text-align: center; margin-top: 15px;margin-bottom: 15px; padding: 0 15% 0 15%; width: 100%; box-sizing: border-box; color: #888da8;;">
                    Welcome to <a href="https://vibeme.herokuapp.com/" target="_blank" style="color: orange; font-size: 1.1em; text-decoration: none;">VibeMe</a>
                </p>
                <p
                    style="font-family: 'Ubuntu', sans-serif; font-weight: 400; text-align: center; margin-top: 15px;margin-bottom: 15px; padding: 0 15% 0 15%; width: 100%; box-sizing: border-box; line-height: 1.3em; color: #888da8;">
                    Please click the button below to confirm your email address and activate your account 
                </p>
                <a href="http://${link}" target="_blank">
                    <button style="
                    background: #000000;
                    background: -webkit-linear-gradient(to right, #434343, #000000);
                    background: linear-gradient(to right, #434343, #000000); 
                    border: none; border-radius: 50px; height: 40px; width: 160px;
                    color: white;
                    margin-top: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;">CONFIRM EMAIL</button>
                </a>
                <p
                    style="font-family: 'Ubuntu', sans-serif; font-weight: 400; text-align: center; margin-top: 15px;margin-bottom: 15px; padding: 0 15% 0 15%; width: 100%; box-sizing: border-box; line-height: 1.3em; color: #888da8;">
                    Or alternatively you can <a href="http://${link}" target="_blank" style="text-decoration: none; opacity: 0.5;"> click here</a> 
                </p>
                <p style="font-family: 'Ubuntu', sans-serif; font-weight: 400; text-align: center; margin-top: 15px;margin-bottom: 15px; padding: 0 15% 0 15%; width: 100%; box-sizing: border-box; line-height: 1.3em; color: #888da8; opacity: 0.7;">
                    If you received this in error, simply ignore this email and do not click the button
                </p>
                <div style="margin-bottom: 27px;"></div>
            </div>
        </div>
        <p style="text-align: center; margin-bottom: 50px; font-family: 'Ubuntu', sans-serif; font-weight: 500; line-height: 1.3em; color: black; opacity: 0.5; font-size: 16px">Copyright &copy; 2021, VibeMe</p>
    </div>`
};

mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
});
}

module.exports = { sendConfirmationMail };
