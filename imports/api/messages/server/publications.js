import { Meteor }      from 'meteor/meteor';
import { printObject } from '../../helpers/print-objects.js';

import { Messages }    from '../messages.js';
import { Teams }       from '../../teams/teams.js';
import { Boards }      from '../../boards/boards.js';
import { DirectChats } from '../../direct-chats/direct-chats.js';

/**
 * TODO: Pass MESSAGES_LIMIT from client side,
 *       and make pagination work.
 */
Meteor.publish('messages.chat', function ({ directChatId, boardId }) {
  if (!this.userId) {
    this.stop();
    throw new Meteor.Error('Messages.chat.notLoggedIn',
    'Must be logged in to view chats.');
  }

  if ((!directChatId && !boardId) || (!!directChatId && !!boardId)) {
    throw new Meteor.Error('Messages.chat.wrongParameters',
    'There are errors in the passed parameters.');
  }

  if (!!directChatId) {
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
      { boardId },
    ],
  }, {
    sort: {
      createdAt: -1,
    },
    limit: MESSAGES_LIMIT,
  });
});

Meteor.publish('messages.last', function (teamUrl) {
  if (!this.userId) {
    this.stop();
    throw new Meteor.Error('Messages.last.notLoggedIn',
    'Must be logged in to view chats.');
  }

  const MESSAGES_LIMIT = 1;
  const user = Meteor.users.findOne(this.userId);
  const teamId = Teams.findOne({ url: teamUrl })._id;

  let directChats = DirectChats.getUserDirectChats(this.userId, teamId).fetch();
  directChats = directChats.map(directChat => directChat._id);

  const boards = user.boards(teamId).fetch().map(board => board._id);

  ReactiveAggregate(this, Messages, [
    {
      $match: {
        $or: [
          {
            boardId: {
              $in: boards,
            },
          },
          {
            directChatId: {
              $in: directChats,
            },
          },
        ],
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: {
          boardId: '$boardId',
          directChatId: '$directChatId',
        },
        messages: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $project: {
        _id: 0,
        messages: {
          $slice: ['$messages', 0, MESSAGES_LIMIT],
        },
      },
    },
    {
      $unwind: '$messages',
    },
    {
      $project: {
        _id: '$messages._id',
        senderId: '$messages.senderId',
        type: '$messages.type',
        content: '$messages.content',
        createdAt: '$messages.createdAt',
        boardId: '$messages.boardId',
        directChatId: '$messages.directChatId',
        seers: '$messages.seers',
        seen: '$messages.seen',
      },
    },
  ]);
});

/* global ReactiveAggregate */
