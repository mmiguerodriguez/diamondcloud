import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Teams }           from '../teams/teams.js';

export const insertFirstUser = new ValidatedMethod({
  name: 'Accounts.methods.insertFirstUser',
  validate: new SimpleSchema({
    url: { type: String },
  }).validator(),
  run({ url }) {
    let team = Teams.findOne({ url });

    if (team.users.length === 0) {
      let user = { email: Meteor.user().email(), hierarchy: 'sistemas' };
      Teams.addUser(team._id, user);
    }
  }
});