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
    <html><head>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

</head>
<body style="
    font-family: roboto;
">
<img src="http://diamondcloud.tk/img/logo.svg" style="display: block;margin: 0 auto;width: 25%;">
<div style="
    width: 100%;
    height: 50px;
    background-color: #2ecc71;
">
<p style="
    text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;
">Te han compartido un equipo!</p>
	<p style="
">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`">
    <button class="btn btn-info col-xs-6 col-xs-offset-3" style="
    height: 65px;
">Click me</button>
      <br> <br>
</a>
	</p>
  <br> <br>
	<p>Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>`, //Email sent to not registered users that are shared a team
    sharedTeamRegistered: (teamId) => `
    <html><head>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

</head>
<body style="
    font-family: roboto;
">
<img src="http://diamondcloud.tk/img/logo.svg" style="display: block;margin: 0 auto;width: 25%;">
<div style="
    width: 100%;
    height: 50px;
    background-color: #2ecc71;
">
<p style="
    text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;
">Te han compartido un equipo!</p>
	<p style="
">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`">
    <button class="btn btn-info col-xs-6 col-xs-offset-3" style="
    height: 65px;
">Click me</button>
      <br> <br>
</a>
	</p>
  <br> <br>
	<p>Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>`, //Email sent to registered users that are shared a team
  },
};
