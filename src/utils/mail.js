const request = require('request');

const sendConfirmationMail = (link,email)=>{
    const options = {
      method: 'POST',
      url: 'https://email-sender1.p.rapidapi.com/',
      qs: {
        txt_msg: 'Thank you for subscribing',
        to: `${email}`,
        from: 'VibeMe',
        subject: 'Confirmation mail',
        html_msg: `<div>Thanks for creating your account on vibeme.</div><div>Please click on the following button to activate your account by confirming your mail address</div><div> <a href="http://${link}" target="_blank"> <button > Click here to confirm your email </button> </a></div> <div > Or alterantively you can <a href="http://${link}" target="_blank"> click here</a> </div>`,
      },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'email-sender1.p.rapidapi.com',
        'x-rapidapi-key': process.env.API_KEY,
        useQueryString: true
      },
      json: true
    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });

};

module.exports = {sendConfirmationMail};
