import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Messages }        from './messages.js';
import { Boards }          from '../boards/boards.js';
import { DirectChats }     from '../direct-chats/direct-chats.js';

export const sendMessage = new ValidatedMethod({
  name: 'Messages.methods.send',
  validate: new SimpleSchema({
    directChatId: { type: String, optional: true },
    boardId: { type: String, optional: true },
    type: { type: String, allowedValues: ['text'] },
    content: { type: String },
    createdAt: { type: Number }
  }).validator(),
  run({ directChatId, boardId, type, content, createdAt }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Messages.methods.send.notLoggedIn',
      'Must be logged in to send a message.');
    }

    let message = {
      senderId: Meteor.user()._id,
      type,
      content,
      createdAt,
    };

    // Check if board or directChat exists
    if (!!directChatId) {
      message.directChatId = directChatId;
      message.seen = false;

      let users = DirectChats.findOne(directChatId).users;
      users.forEach((user, index, array) => {
        if(user._id !== message.senderId) {
          array[index].notifications = user.notifications + 1;
        }
      });

      DirectChats.update(directChatId, {
        $set: {
          users,
        }
      });
    } else if (!!boardId) {
      message.boardId = boardId;
      message.seers = [];

      let users = Boards.findOne(boardId).users;
      users.forEach((user, index, array) => {
        array[index].notifications = user.notifications + 1;
      });

      Boards.update(boardId, {
        $set: {
          users,
        }
      });
    } else {
      throw new Meteor.Error('Messages.methods.send.noDestination',
      'Must have a destination to send a message.');
    }

    Messages.insert(message);
    return message;
  },
});

export const seeMessage = new ValidatedMethod({
  name: 'Messages.methods.see',
  validate: new SimpleSchema({
    messageId: { type: String, regEx: SimpleSchema.RegEx.Id, },
  }).validator(),
  run({ messageId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Messages.methods.see.notLoggedIn',
      'Must be logged in to see a message.');
    }

    let message = Messages.findOne(messageId);
    if (message.boardId) {
      Messages.update(messageId, {
        $push: {
          seers: Meteor.user()._id,
        }
      });
    } else {
      Messages.update(messageId, {
        $set: {
          seen: true,
        }
      });

      let users = DirectChats.findOne(message.directChatId).users;
      users.forEach((user, index, array) => {
        if(user._id !== message.senderId) {
          array[index].notifications = 0;
        }
      });

      DirectChats.update(message.directChatId, {
        $set: {
          users,
        }
      });
    }

    message = Messages.findOne(messageId);
    return message;
  }
});
