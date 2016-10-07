import { Meteor }      from 'meteor/meteor';
import { Messages }    from '../messages.js';

import { DirectChats } from '../../direct-chats/direct-chats.js';
import { Boards }      from '../../boards/boards.js';

Meteor.publish('messages.chat', function({ directChatId, boardId, limit }) {
  if (!this.userId) {
    throw new Meteor.Error('Messages.chat.notLoggedIn',
    'Must be logged in to view chats.');
  }

  if ((!directChatId && !boardId) || (!!directChatId && !!boardId)) {
    throw new Meteor.Error('Messages.chat.wrongParameters',
    'There are errors in the passed parameters.');
  }

  if (!!directChatId){
    if (!DirectChats.isValid(directChatId, this.userId)) {
      throw new Meteor.Error('Messages.chat.wrongParameters',
      'There are errors in the passed parameters.');
    } else {
      boardId = '';
    }
  } else {
    if (!Boards.isValid(boardId, this.userId)) {
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
  }, {
    limit,
  });
});

Meteor.publish('messages.all', function(teamId) {
  if (!this.userId) {
    throw new Meteor.Error('Messages.all.notLoggedIn',
    'Must be logged in to view chats.');
  }
  
  const MESSAGES_LIMIT = 1;
  let user = Meteor.users.findOne(this.userId);

  let directChats = DirectChats.getUserDirectChats(this.userId, teamId).fetch();
  directChats = directChats.map((directChat) => {
    return directChat._id;
  });
  
  let boards = user.boards(teamId).fetch();
  boards = boards.map((board) => {
    return board._id;
  });

  return Messages.find({
    $or: [
      {
        directChatId: {
          $in: directChats
        },
      },
      {
        boardId: {
          $in: boards
        }
      }
    ]
  }, {
    sort: {
      limit: MESSAGES_LIMIT,
    }
  });
});