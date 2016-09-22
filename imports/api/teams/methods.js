import { Meteor }               from 'meteor/meteor';
import { ValidatedMethod }      from 'meteor/mdg:validated-method';
import { SimpleSchema }         from 'meteor/aldeed:simple-schema';
import  Future                  from 'fibers/future';
import { Mail }                 from '../mails/mails.js';

import { Teams }                from './teams.js';
import { Boards }               from '../boards/boards.js';
import { createBoard }          from '../boards/methods.js';
import { createModuleData }     from '../module-data/module-data-creation.js';

export const createTeam = new ValidatedMethod({
  name: 'Teams.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    plan: { type: String, allowedValues: ['free', 'premium'] },
    type: { type: String, min: 0, max: 200 },
    usersEmails: { type: [String] },
  }).validator(),
  run({ name, plan, type, usersEmails }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.create.notLoggedIn',
      'Must be logged in to make a team.');
    }

    let team, teamId, boardUsers = [];

    team = {
      name,
      plan,
      type,
      boards: [],
      users: [
        { email: Meteor.user().emails[0].address, permission: 'owner' }
      ],
      archived: false,
    };

    usersEmails.forEach(function(email) {
      team.users.push({ email, permission: 'member' });
      boardUsers.push({ email });
    });

    let future = new Future(); // Needed to make asynchronous call to db
    Teams.insert(team, (err, res) => {
      if(err) throw new Meteor.Error(err);
      createModuleData();
      teamId = res;
      createBoard.call({
        teamId,
        name: 'General',
        users: boardUsers,
        isPrivate: false,
      }, (err, res) => {
        if(!!err) future.throw(err);

        team.boards.push({ _id: res._id });
        team._id = teamId;
        usersEmails.forEach((email) => {
          if (Meteor.users.findByEmail(email, {}).count() === 0) {
            //if user is not registered in Diamond Cloud
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              html:`<html><head>



<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<body class="bodyClass">
<style type='text/css'>
.mainDiv{width: 100%;
    height: 50px;
    background-color: #2ecc71;}
.pTitle{text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;}
.boton{height: 65px;}
.imagen{display: block;margin: 0 auto;width: 25%;}
.bodyClass{font-family: roboto;}
</style>
<img src="http://i.imgur.com/O6iMN59.png" style="display: block;margin: 0 auto;width: 25%;" class="imagen">
<div class="mainDiv">
<p class="pTitle" style="width: 100%;
    
    font-size:25px;
    background-color: #3498db;
    text-align: center;
    color: white;
    padding-top:15px;
    padding-bottom:15px;
    font-weight: bold;
    font-family: 'roboto', sans-serif;">Te han compartido un equipo!</p>
	<p style="font-size:20px; padding-left: 15px;padding-right:15px;">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`" style="display: block;
width: 200px;
font-size:18px;
padding:15px;
background: #2ecc71;
display: block;
margin: auto 0;
text-align: center;
border-radius: 5px;
color: white;
font-weight: bold;
 text-decoration: none;
">Ingresar al equipo
</a>
	</p>
  <br>
	<p style="font-size:20px;padding-left:15px;padding-right:15px;">Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>` ,
            });
          } else {
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              html:`<html><head>



<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<body class="bodyClass">
<style type='text/css'>
.mainDiv{width: 100%;
    height: 50px;
    background-color: #2ecc71;}
.pTitle{text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;}
.boton{height: 65px;}
.imagen{display: block;margin: 0 auto;width: 25%;}
.bodyClass{font-family: roboto;}
</style>
<img src="http://i.imgur.com/O6iMN59.png" style="display: block;margin: 0 auto;width: 25%;" class="imagen">
<div class="mainDiv">
<p class="pTitle" style="width: 100%;
    
    font-size:25px;
    background-color: #3498db;
    text-align: center;
    color: white;
    padding-top:15px;
    padding-bottom:15px;
    font-weight: bold;
    font-family: 'roboto', sans-serif;">Te han compartido un equipo!</p>
	<p style="font-size:20px; padding-left: 15px;padding-right:15px;">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`" style="display: block;
width: 200px;
font-size:18px;
padding:15px;
background: #2ecc71;
display: block;
margin: auto 0;
text-align: center;
border-radius: 5px;
color: white;
font-weight: bold;
 text-decoration: none;
">Ingresar al equipo
</a>
	</p>
  <br>
	<p style="font-size:20px;padding-left:15px;padding-right:15px;">Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>`,
            });
          }
        });
        future.return(team);
      });
    });

    return future.wait();
  }
});

export const editTeam = new ValidatedMethod({
  name: 'Teams.methods.edit',
  validate: new SimpleSchema({
    'teamId': { type: String },
    'team': { type: Object },
    'team.name': { type: String, optional: true, },
    'team.plan': { type: String, optional: true, allowedValues: ['free', 'premium'] },
    'team.type': { type: String, optional: true, },
  }).validator(),
  run({ team, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.edit.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    Teams.update({ _id: teamId }, {
      $set: team
    });
    return Teams.findOne(teamId);
  }
});

export const shareTeam = new ValidatedMethod({
  name: 'Teams.methods.share',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    teamId: { type: String }
  }).validator(),
  run({ email, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.share.notLoggedIn',
      'Must be logged in to edit a team.');
    }
    let team = Teams.findOne(teamId);
    if(Meteor.user().emails[0].address !== team.owner()){
      throw new Meteor.Error('Teams.methods.share.notOwner',
      "Must be team's owner to share");
    }
    let user = { email, permission: 'member' };

    Teams.addUser(teamId, user);
    if(Meteor.users.findByEmail(email, {}).count() === 0) {
      //if user is not registered in Diamond Cloud
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        html: `<html><head>



<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<body class="bodyClass">
<style type='text/css'>
.mainDiv{width: 100%;
    height: 50px;
    background-color: #2ecc71;}
.pTitle{text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;}
.boton{height: 65px;}
.imagen{display: block;margin: 0 auto;width: 25%;}
.bodyClass{font-family: roboto;}
</style>
<img src="http://i.imgur.com/O6iMN59.png" style="display: block;margin: 0 auto;width: 25%;" class="imagen">
<div class="mainDiv">
<p class="pTitle" style="width: 100%;
    
    font-size:25px;
    background-color: #3498db;
    text-align: center;
    color: white;
    padding-top:15px;
    padding-bottom:15px;
    font-weight: bold;
    font-family: 'roboto', sans-serif;">Te han compartido un equipo!</p>
	<p style="font-size:20px; padding-left: 15px;padding-right:15px;">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`" style="display: block;
width: 200px;
font-size:18px;
padding:15px;
background: #2ecc71;
display: block;
margin: auto 0;
text-align: center;
border-radius: 5px;
color: white;
font-weight: bold;
 text-decoration: none;
">Ingresar al equipo
</a>
	</p>
  <br>
	<p style="font-size:20px;padding-left:15px;padding-right:15px;">Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>`,
      });
    } else {
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        html: `<html><head>



<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<body class="bodyClass">
<style type='text/css'>
.mainDiv{width: 100%;
    height: 50px;
    background-color: #2ecc71;}
.pTitle{text-align: center;
    color: white;
    font-weight: bold;
    padding: 15px;
    font-family: 'roboto', sans-serif;}
.boton{height: 65px;}
.imagen{display: block;margin: 0 auto;width: 25%;}
.bodyClass{font-family: roboto;}
</style>
<img src="http://i.imgur.com/O6iMN59.png" style="display: block;margin: 0 auto;width: 25%;" class="imagen">
<div class="mainDiv">
<p class="pTitle" style="width: 100%;
    
    font-size:25px;
    background-color: #3498db;
    text-align: center;
    color: white;
    padding-top:15px;
    padding-bottom:15px;
    font-weight: bold;
    font-family: 'roboto', sans-serif;">Te han compartido un equipo!</p>
	<p style="font-size:20px; padding-left: 15px;padding-right:15px;">
	Bienvenido a Diamond Cloud!
	
<br><br>
	Un compañero te compartió su equipo!
	<br><br>
	<a href="diamondcloud.tk/team/`+teamId+`" style="display: block;
width: 200px;
font-size:18px;
padding:15px;
background: #2ecc71;
display: block;
margin: auto 0;
text-align: center;
border-radius: 5px;
color: white;
font-weight: bold;
 text-decoration: none;
">Ingresar al equipo
</a>
	</p>
  <br>
	<p style="font-size:20px;padding-left:15px;padding-right:15px;">Hacé click en el botón para trabajar con tu equipo!</p>
</div>


</body></html>`,
      });
    }
    return Teams.findOne(teamId);
  }
});

export const removeUserFromTeam = new ValidatedMethod({
  name: 'Teams.methods.removeUser',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    teamId: { type: String },
  }).validator(),
  run({ email, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.removeUser.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    let team = Teams.findOne(teamId);
    let user = Meteor.users.findByEmail(email).fetch()[0];
    if(Meteor.user().emails[0].address !== team.owner()){
      throw new Meteor.Error('Teams.methods.removeUser.notOwner',
      "Must be team's owner to remove user");
    }

    //remove user from boards
    let boards = user.boards(teamId).fetch();
    boards.forEach((board) => {
      Boards.removeUser(board._id, user._id);
    });
    Teams.removeUser(teamId, email);

    return Teams.findOne(teamId);
  }
});

export const archiveTeam = new ValidatedMethod({
  name: 'Teams.methods.archive',
  validate: new SimpleSchema({
    teamId: { type: String },
  }).validator(),
  run({ teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.archive.notLoggedIn',
      'Must be logged in to archive a team.');
    }
    // Verify user is the team owner
    let team = Teams.findOne(teamId);
    if (team.owner() !== Meteor.user().emails[0].address)
      throw new Meteor.Error('Teams.methods.archive.notTeamOwner',
      'Must be the team owner to archive the team.');

    Teams.update(teamId, {
      $set: {
        archived: true,
      }
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  }
});

export const dearchiveTeam = new ValidatedMethod({
  name: 'Teams.methods.dearchive',
  validate: new SimpleSchema({
    teamId: { type: String },
  }).validator(),
  run({ teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.dearchive.notLoggedIn',
      'Must be logged in to archive a team.');
    }

    // Verify user is the team owner
    let team = Teams.findOne(teamId);
    if (team.owner() !== Meteor.user().emails[0].address) {
      throw new Meteor.Error('Teams.methods.dearchive.notTeamOwner',
      'Must be the team owner to archive the team.');
    }

    Teams.update(teamId, {
      $set: {
        archived: false,
      }
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  }
});
