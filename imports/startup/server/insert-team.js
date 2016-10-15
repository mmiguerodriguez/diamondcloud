import { Teams }      from '../../api/teams/teams.js';
import { createTeam } from '../../api/teams/methods.js';

if (Teams.find().count() === 0) {
  const TEAMS = [
    { name: 'Carlos y Darío', plan: 'free', type: 'Agencia publicitaria', url: 'carlosydario' },
    { name: 'Diamond Cloud', plan: 'premium', type: 'Web', url: 'diamond' },
  ];
  
  TEAMS.forEach((team) => {
    createTeam.call(team, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }
    });
  });
}