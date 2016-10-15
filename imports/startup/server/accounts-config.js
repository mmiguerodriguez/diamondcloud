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
