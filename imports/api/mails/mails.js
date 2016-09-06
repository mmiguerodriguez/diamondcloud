let mailgun = require('mailgun-js');
export let sendMail = ({ from, to, subject, text }) => {
  let api_key = 'key-014b7f99a31ee6791c7c020ba5e8f7fb';
  let domain = 'https://api.mailgun.net/v3/diamondcloud.tk';

  mailgun = mailgun({ apiKey: api_key, domain: domain });
  let data = {
    from,
    to,
    subject,
    text
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(error, body);
  });
};