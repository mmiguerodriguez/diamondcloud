import { Accounts }  from 'meteor/accounts-base';

import { shareTeam } from '../../api/teams/methods';
import { Teams }     from '../../api/teams/teams';

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
Accounts.onCreateUser((options, _user) => {
  const user = _user;

  const service = Object.keys(user.services);
  const name = user.services[service].name;
  const email = user.services[service].email;
  const picture = user.services[service].picture;

  user.emails = [{ address: email }];
  user.profile = {
    name,
    picture,
  };

  return user;
});
