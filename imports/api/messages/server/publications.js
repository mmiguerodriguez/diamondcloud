import { Meteor }      from 'meteor/meteor';
import { Messages }    from '../messages.js';

import { DirectChats } from '../../direct-chats/direct-chats.js';
import { Boards }      from '../../boards/boards.js';

Meteor.publish('messages.chat', function({ directChatId, boardId }) {
  if (!Meteor.user()) {
    throw new Meteor.Error('Messages.chat.notLoggedIn', 
    'Must be logged in to view chats.');
  }
  
  if((!directChatId && !boardId) || (!!directChatId && !!boardId)) {
    throw new Meteor.Error('Messages.chat.wrongParameters', 
    'There are errors in the passed parameters.');
  }
  
  if(!!directChatId){
    if(!DirectChats.isValid(directChatId, this.userId)) {
      throw new Meteor.Error('Messages.chat.wrongParameters', 
      'There are errors in the passed parameters.');
    } else {
      boardId = '';
    }
  } else {    
    if(!Boards.isValid(boardId, this.userId)) {
      throw new Meteor.Error('Messages.chat.wrongParameters', 
      'There are errors in the passed parameters.');
    } else {
      directChatId = '';
    }
  }

  return Messages.find({
    $or: [
      { directChatId },
      { boardId }
    ],
  });
});