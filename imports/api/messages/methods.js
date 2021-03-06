import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Messages }        from './messages';
import { Boards }          from '../boards/boards';
import { DirectChats }     from '../direct-chats/direct-chats';
import { Notifications }   from '../notifications/notifications';

export const sendMessage = new ValidatedMethod({
  name: 'Messages.methods.send',
  validate: new SimpleSchema({
    directChatId: { type: String, optional: true },
    boardId: { type: String, optional: true },
    type: { type: String, allowedValues: ['text'] },
    content: { type: String },
  }).validator(),
  run({ directChatId, boardId, type, content }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Messages.methods.send.notLoggedIn',
      'Must be logged in to send a message.');
    }

    const message = {
      senderId: Meteor.userId(),
      type,
      content,
      createdAt: new Date().getTime(),
    };

    // Check if board or directChat exists
    if (directChatId) {
      message.directChatId = directChatId;
      message.seen = false;
      DirectChats.addNotification(directChatId, message.senderId);

      Notifications.send({
        directChatId,
        message,
      });
    } else if (boardId) {
      message.boardId = boardId;
      message.seers = [];
      Boards.addNotification(boardId, message.senderId);

      Notifications.send({
        boardId,
        message,
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
    messageId: { type: String, regEx: SimpleSchema.RegEx.Id },
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
          seers: Meteor.userId(),
        },
      });
      Boards.resetNotifications(message.boardId, message.senderId);
    } else if (message.directChatId) {
      Messages.update(messageId, {
        $set: {
          seen: true,
        },
      });
      DirectChats.resetNotifications(message.directChatId, message.senderId);
    }

    message = Messages.findOne(messageId);
    return message;
  },
});
