import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import Future from 'fibers/future';

import { DirectChats }     from './direct-chats.js';
import { Teams }           from '../teams/teams.js';

export const createDirectChat = new ValidatedMethod({
  name: 'DirectChats.methods.create',
  validate: new SimpleSchema({
    teamId: { type: String },
    userId: { type: String }, // We assume chat is between given and current users
  }).validator(),
  run({ teamId, userId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('DirectChats.methods.create.notLoggedIn',
      'Must be logged in to make a team.');
    }

    let team = Teams.findOne(teamId);
    if (!team.hasUser({ _id: Meteor.userId() }) || !team.hasUser({ _id: userId })) {
      throw new Meteor.Error('DirectChats.methods.create.notInTeam',
      'Either you or your contact are not on the team.');
    }

    let directChat = {
      teamId,
      users: [
        { _id: Meteor.userId() },
        { _id: userId },
      ],
    };

    let future = new Future();
    DirectChats.insert(directChat, (err, res) => {
      if(!!err) future.throw(err);
      
      directChat._id = res;
      future.return(directChat);
    });

    return future.wait();
  }
});
