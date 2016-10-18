import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import Future              from 'fibers/future';

import { DirectChats }     from './direct-chats';
import { Teams }           from '../teams/teams';

/**
 * Creates a directChat between two users
 * If the board is private, it pushes as users the
 * parameter users, but when it isn't, it pushes
 * the team users.
 *
 * @type {ValidatedMethod}
 * @param {String} teamId
 * @param {String} userId
 *   The user we are creating a direct-chat with
 * @returns {Object} directChat
 *   The created directChat
 */
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

    const team = Teams.findOne(teamId);
    if (!team.hasUser({ _id: Meteor.userId() }) || !team.hasUser({ _id: userId })) {
      throw new Meteor.Error('DirectChats.methods.create.notInTeam',
      'Either you or the user are not on the team.',
      'user_not_in_team');
    }

    const userChats = DirectChats.getUserDirectChats(Meteor.userId(), teamId).fetch();
    userChats.forEach((chats) => {
      chats.users.forEach((user) => {
        if (user._id === userId) {
          throw new Meteor.Error('DirectChats.methods.create.chatExists',
          'The chat with this user already exists.',
          'chat_exists');
        }
      });
    });

    const directChat = {
      teamId,
      users: [
        { _id: Meteor.userId(), notifications: 0 },
        { _id: userId, notifications: 0 },
      ],
    };

    const future = new Future();
    DirectChats.insert(directChat, (error, result) => {
      if (error) {
        future.throw(error);
      }

      directChat._id = result;
      future.return(directChat);
    });

    return future.wait();
  },
});
