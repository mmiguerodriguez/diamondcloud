import { Teams, TEAMS }      from '../../api/teams/teams';
import { createTeam }        from '../../api/teams/methods';

if (Teams.find().count() === 0) {
  TEAMS.forEach((team) => {
    createTeam.call(team, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }
    });
  });
}
