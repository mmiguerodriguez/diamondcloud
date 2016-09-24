let api_key = 'key-014b7f99a31ee6791c7c020ba5e8f7fb';
let domain = 'diamondcloud.tk';
let mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

export let Mail = {
  sendMail({ from, to, subject, text, html }) {
    from = from || 'Diamond Cloud <no-reply@diamondcloud.tk>';
    let data = {
      from,
      to,
      subject,
      html,
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(error, body);
    });
  },
  messages: {
    sharedTeamRegistered: (teamId) => `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <style type='text/css'>
            .mainDiv {
              width: 100%;
              height: 50px;
              background-color: #2ecc71;
            }
            .pTitle {
              text-align: center;
              color: white;
              font-weight: bold;
              padding: 15px;
              font-family: 'roboto', sans-serif;
            }
            .boton {
              height: 65px;
            }
            .imagen {
              display: block;
              margin: 0 auto;
              width: 25%;
            }
            .bodyClass {
              font-family: roboto;
            }
          </style>
        </head>
        <body class="bodyClass">
          <img src="http://i.imgur.com/O6iMN59.png" style="display: block; margin: 0 auto;width: 25%;" class="imagen">
          <div class="mainDiv">
            <p class="pTitle" style="width: 100%; font-size:25px; background-color: #3498db; text-align: center; color: white; padding-top:15px; padding-bottom:15px; font-weight: bold; font-family: 'roboto', sans-serif;">Te han compartido un equipo!</p>
  	        <p style="font-size:20px; padding-left: 15px;padding-right:15px;">Bienvenido a Diamond Cloud!
              <br>
              <br>
    	         Un compañero te compartió su equipo!
              <br>
              <br>
              <a href="diamondcloud.tk/team/`+teamId+`" style="display: block; width: 200px; font-size:18px; padding:15px; background: #2ecc71; display: block; margin: auto 0; text-align: center; border-radius: 5px; color: white; font-weight: bold; text-decoration: none;">Ingresar al equipo</a>
            </p>
            <br>
            <p style="font-size:20px; padding-left:15px; padding-right:15px;">Hacé click en el botón para trabajar con tu equipo!</p>
          </div>
        </body>
      </html>`,//Email sent to registered users that are shared a team
    sharedTeamNotRegistered: (teamId) => `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <style type='text/css'>
            .mainDiv {
              width: 100%;
              height: 50px;
              background-color: #2ecc71;
            }
            .pTitle {
              text-align: center;
              color: white;
              font-weight: bold;
              padding: 15px;
              font-family: 'roboto', sans-serif;
            }
            .boton {
              height: 65px;
            }
            .imagen {
              display: block;
              margin: 0 auto;
              width: 25%;
            }
            .bodyClass {
              font-family: roboto;
            }
          </style>
        </head>
        <body class="bodyClass">
          <img src="http://i.imgur.com/O6iMN59.png" style="display: block; margin: 0 auto; width: 25%;" class="imagen">
          <div class="mainDiv">
            <p class="pTitle" style="width: 100%; font-size:25px; background-color: #3498db; text-align: center; color: white; padding-top:15px; padding-bottom:15px; font-weight: bold; font-family: 'roboto', sans-serif;">Te han invitado a un equipo!</p>
            <p style="font-size:20px; padding-left: 15px;padding-right:15px;">Bienvenido a Diamond Cloud!
              <br>
              <br>
              Un compañero te compartió su equipo!
              <br>
              <br>
              <a href="diamondcloud.tk/team/`+teamId+`" style="display: block; width: 200px; font-size:18px; padding:15px; background: #2ecc71; display: block; margin: auto 0; text-align: center; border-radius: 5px; color: white; font-weight: bold; text-decoration: none;">Ingresar al equipo</a>
            </p>
            <br>
              <p style="font-size:20px; padding-left:15px; padding-right:15px;">Hacé click en el botón para loguearte con Google y colaborar con tu equipo!</p>
          </div>
        </body>
      </html>`,
  },
};
