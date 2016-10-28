import { Teams }      from '../../api/teams/teams';
import { createTeam } from '../../api/teams/methods';

if (Teams.find().count() === 0) {
  const TEAMS = [
    { name: 'Carlos y Darío', plan: 'free', type: 'Agencia publicitaria', url: 'carlosydario' },
    { name: 'Carlos y Darío', plan: 'free', type: 'Agencia publicitaria', url: 'presentacion' }, // TODO: remove
    { name: 'Diamond Cloud', plan: 'premium', type: 'Plataforma web', url: 'diamond' },
  ];

  TEAMS.forEach((team) => {
    createTeam.call(team, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }
    });
  });
}
