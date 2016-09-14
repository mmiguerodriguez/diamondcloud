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
      senderId: Meteor.userId(),
      type,
      content,
      createdAt,
    };

    // Check if board or directChat exists
    if (!!directChatId) {
      message.directChatId = directChatId;
      message.seen = false;
      DirectChats.addNotification(directChatId, message.senderId);
    } else if (!!boardId) {
      message.boardId = boardId;
      message.seers = [];
      Boards.addNotification(boardId, message.senderId);
    } else {
      throw new Meteor.Error('Messages.methods.send.noDestination',
      'Must have a destination to send a message.');
    }

    Messages.insert(message);

    // Notifications

    let title;
    let text = type == 'text' ? message.content : 'File';
    let users = (!!directChatId ? DirectChats.findOne(directChatId) : Boards.findOne(boardId)).users;
    let query;
    
    console.log('hola ioni', users);
    
    if (!!directChatId) {
      users = users.map((user) => {
        if (user._id != Meteor.user()._id) {
          return user._id;
        }
      });
    } else if (!!boardId) {
      users = users.map((user) => {
        if (Meteor.users.find({ 'emails.address': user.email })._id != Meteor.user()._id) {
          return Meteor.users.find({ 'emails.address': user.email })._id;
        }
      });
    }
    

    query = {
      userId: {
        $in: users,
      }
    };

    if (!!boardId) {
      title = Boards.findOne(boardId).name;
    } else if (!!directChatId) {
      title = users[0] === undefined ? users[1] : users[0];
    }
    
    console.log('Trello', title, !!directChatId ? 'directchat' : 'board', users[0], users[1]);

    Push.send({
      from: 'Diamond',
      title,
      text,
      query,
    });

    return message;
  },
});

export const seeMessage = new ValidatedMethod({
  name: 'Messages.methods.see',
  validate: new SimpleSchema({
    messageId: { type: String, regEx: SimpleSchema.RegEx.Id, },
  }).validator(),
  run({ messageId }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('Messages.methods.see.notLoggedIn',
      'Must be logged in to see a message.');
    }

    let message = Messages.findOne(messageId);
    if (message.boardId) {
      Messages.update(messageId, {
        $push: {
          seers: Meteor.userId(),
        }
      });
      Boards.resetNotifications(message.boardId, message.senderId);
    } else if(message.directChatId) {
      Messages.update(messageId, {
        $set: {
          seen: true,
        }
      });
      DirectChats.resetNotifications(message.directChatId, message.senderId);
    }

    message = Messages.findOne(messageId);
    return message;
  }
});
