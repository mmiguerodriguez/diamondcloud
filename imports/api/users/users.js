import { Mongo } from 'meteor/mongo';

import { Teams } from '../teams/teams.js';

Meteor.users.helpers({
  teams({ fields }) {
    fields = fields || {};
    
    let teams = Teams.find({
      users: {
        $elemMatch: {
          email: this.emails[0].address,
        }
      },
      archived: false,
    }, { fields }); // translates to -> { fields: { name: 1 } }
    
    if(teams)
      return teams;
  }
});