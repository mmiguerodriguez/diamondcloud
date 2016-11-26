import { Mongo } from 'meteor/mongo';

import { Team } from '../teams/teams';

export let Hierarchies = new Mongo.Collection('Hierarchies');

Hierarchies.helpers({
  team(fields = {}) {
    return Team.findOne({
      _id: this.teamId,
    }, { fields });
  }
});