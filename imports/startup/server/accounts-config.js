import { shareTeam } from '../../api/teams/methods.js';
import { Teams }     from '../../api/teams/teams.js';

/**
 * Callback when a user is created.
 * @param {Function} func
 *  @param {Object} options
 *  @param {Object} user
 *    The actual user object that had been
 *    created, and we are modifying.
 * @returns {Object} user
 *  The user we will be inserting to the
 *  database.
 */
Accounts.onCreateUser((options, user) => {
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

/**
 * Callback when an user logs in.
 * @param {Function} func
 *
 * 
 * TODO: Get the team url depending from the actual route
 */
Accounts.onLogin(() => {
  console.log(Teams.find().fetch());
  let team = Teams.findOne({ url: 'carlosydario' }); // TODO: GET ROUTE!!!
  
  if (team.users.length === 0) {
    Teams.update({ _id: team._id }, {
      $push: {
        users: {
          email: Meteor.user().email(),
          hierarchy: 'sistemas',
        },
      },
    });
  }
});