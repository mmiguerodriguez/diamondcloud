import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Teams }           from '../teams/teams';

export const insertFirstUser = new ValidatedMethod({
  name: 'Accounts.methods.insertFirstUser',
  validate: new SimpleSchema({
    url: { type: String },
  }).validator(),
  run({ url }) {
    const team = Teams.findOne({ url });

    if (team.users.length === 0) {
      const user = { email: Meteor.user().email(), hierarchy: 'sistemas' };
      Teams.addUser(team._id, user);
    }
  },
});
