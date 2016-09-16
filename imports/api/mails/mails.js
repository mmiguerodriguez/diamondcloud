let api_key = 'key-014b7f99a31ee6791c7c020ba5e8f7fb';
let domain = 'diamondcloud.tk';
let mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

export let Mail = {
  sendMail({ from, to, subject, text }) {
    from = from || 'Diamond Cloud <no-reply@diamondcloud.tk>';
    let data = {
      from,
      to,
      subject,
      text
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error, body);
    });
  },
  messages: {
    sharedTeamNotRegistered: (teamId) => `
      Te compartieron un equipo en Diamond Cloud! Entrá a http://diamondcloud.tk/team/` + teamId +
      ` para registrarte con tu cuenta de Google y empezar a colaborar con tu equipo!`, //Email sent to not registered users that are shared a team
    sharedTeamRegistered: (teamId) => `
      Te compartieron un equipo en Diamond Cloud! Entrá a http://diamondcloud.tk/team/` + teamId +
      ` para empezar a colaborar con tu equipo!`, //Email sent to registered users that are shared a team
  },
};
