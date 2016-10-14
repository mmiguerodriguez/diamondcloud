import { browserHistory } from 'react-router';
import { Teams }          from '../../api/teams/teams.js';

Accounts.onCreateUser(function(options, user){
  const service = Object.keys(user.services);
  let name = user.services[service].name;
  let email = user.services[service].email;
  let picture = user.services[service].picture;

  user.emails = [{ address: email }];
  user.profile = {
    name,
    picture,
  };

  return user;
});

Accounts.onLogin(() => {
  let path;
  
  browserHistory.listen((e) => {
    path = e.pathname;
  });
  
  console.log(path, Teams.find().fetch());
  
  let teamId;
  if (path === '/carlosydario') {
    teamId = Teams.findOne({ url: 'carlosydario' })._id;

    console.log('teamID', teamId);
    browserHistory.push(`/team/${teamId}`);
  } else if (path === '/diamondcloud') {
    teamId = Teams.findOne({ url: 'diamondcloud' })._id;

    console.log('teamID', teamId);
    browserHistory.push(`/team/${teamId}`);
  }
});
