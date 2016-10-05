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
    userId: { type: String },
  }).validator(),
  run({ teamId, userId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('DirectChats.methods.create.notLoggedIn',
      'Must be logged in to make a team.',
      'not_logged');
    }

    let team = Teams.findOne(teamId);
    if (!team.hasUser({ _id: Meteor.userId() }) || !team.hasUser({ _id: userId })) {
      throw new Meteor.Error('DirectChats.methods.create.notInTeam',
      'Either you or the user are not on the team.',
      'user_not_in_team');
    }

    let userChats = DirectChats.getUserDirectChats(Meteor.userId(), teamId).fetch();
    userChats.map((chats) => {
      chats.users.map((user) => {
        if (user._id === userId) {
          throw new Meteor.Error('DirectChats.methods.create.chatExists',
          'The chat with this user already exists.',
          'chat_exists');
        }
      });
    });

    let directChat = {
      teamId,
      users: [
        { _id: Meteor.userId(), notifications: 0 },
        { _id: userId, notifications: 0 },
      ],
    };

    let future = new Future();
    DirectChats.insert(directChat, (err, res) => {
      if (!!err) future.throw(err);

      directChat._id = res;
      future.return(directChat);
    });

    return future.wait();
  }
});
