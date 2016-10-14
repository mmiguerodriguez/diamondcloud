import { Meteor }      from 'meteor/meteor';

import { Messages }    from '../messages.js';
import { Teams }       from '../../teams/teams.js';
import { Boards }      from '../../boards/boards.js';
import { DirectChats } from '../../direct-chats/direct-chats.js';

/**
 * TODO: Pass MESSAGES_LIMIT from client side,
 *       and make pagination work.
 */
Meteor.publish('messages.chat', function({ directChatId, boardId }) {
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
  
  const MESSAGES_LIMIT = 100;

  return Messages.find({
    $or: [
      { directChatId },
      { boardId }
    ],
  }, {
    sort: {
      createdAt: -1,
    },
    limit: MESSAGES_LIMIT,
  });
});

Meteor.publish('messages.last', function(teamUrl) {
  if (!this.userId) {
    throw new Meteor.Error('Messages.last.notLoggedIn',
    'Must be logged in to view chats.');
  }

  const MESSAGES_LIMIT = 1;
  let user = Meteor.users.findOne(this.userId);
  let teamId = Teams.findOne({ url: teamUrl })._id;

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
      createdAt: -1,
    },
    limit: MESSAGES_LIMIT,
  });
});
