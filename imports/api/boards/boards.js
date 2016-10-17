import { Meteor }          from 'meteor/meteor';
import { Mongo }           from 'meteor/mongo';

import { Teams }           from '../teams/teams';
import { Messages }        from '../messages/messages';
import { ModuleInstances } from '../module-instances/module-instances';

export const Boards = new Mongo.Collection('Boards');

Boards.helpers({
  team() {
    return Teams.findOne({
      boards: {
        $elemMatch: {
          _id: this._id,
        },
      },
    });
  },

  getModuleInstances(fields) {
    const moduleInstances = [];

    this.moduleInstances.forEach((moduleInstance) => {
      moduleInstances.push(moduleInstance._id);
    });

    return ModuleInstances.find({
      _id: {
        $in: moduleInstances,
      },
      archived: false,
    }, {
      fields,
    });
  },

  getMessages() {
    return Messages.find({
      boardId: this._id,
    }, {
      sort: {
        createdAt: 1,
      },
    });
  },

  getLastMessage() {
    const messages = this.getMessages().fetch();
    return messages[messages.length - 1] || { content: '' };
  },

  getNotifications() {
    let notifications;

    this.users.forEach((_user) => {
      if (_user.email === Meteor.user().email()) {
        notifications = _user.notifications;
      }
    });

    return notifications || 0;
  },

  getUsers() {
    const f = (x, p) => x.map(e => e[p]);

    const users = Meteor.users.find({
      'emails.address': {
        $in: f(this.users, 'email'),
      },
    }, {
      fields: {
        _id: 1,
      },
    }).fetch();

    // [{ _id }, { _id }, ...] -> ['', '', ...]
    const usersIds = f(users, '_id');

    // remove actual user
    const index = usersIds.indexOf(Meteor.userId());
    usersIds.splice(index, 1);

    return usersIds;
  },
});

Boards.boardFields = {
  name: 1,
  type: 1,
  users: 1,
  isPrivate: 1,
  drawings: 1,
  moduleInstances: 1,
  archived: 1,
  visibleForDirectors: 1,
};

Boards.moduleInstancesFields = {
  x: 1,
  y: 1,
  width: 1,
  height: 1,
  moduleId: 1,
  archived: 1,
  minimized: 1,
};

Boards.getBoards = (boardsIds, userId, fields = {}) => {
  if (Object.prototype.toString.call(boardsIds[0]) === '[object Object]'){
    boardsIds = boardsIds.map(board => board._id);
  }

  // Se asume que todos los boardsIds pertenecen al mismo Team

  const team = Boards.findOne(boardsIds[0]).team();
  const user = Meteor.users.findOne(userId);

  const isDirector =
    team.userIsCertainHierarchy(user.email(), 'director creativo') ||
    team.userIsCertainHierarchy(user.email(), 'director de cuentas') ||
    team.userIsCertainHierarchy(user.email(), 'coordinadores');

  const result = Boards.find({
    $and: [
      {
        _id: {
          $in: boardsIds,
        },
      },
      {
        $or: [
          {
            users: {
              $elemMatch: {
                email: user.email(),
              },
            },
          },
          {
            isPrivate: false,
          },
          {
            $and: [
              {
                visibleForDirectors: true,
              },
              {
                _id: {
                  $in: isDirector ? boardsIds : [],
                },
              },
            ],
          },
        ],
      },
      {
        archived: false,
      },
    ],
  }, {
    fields,
  });

  return result;
};

Boards.isValid = (boardId, userId) => {
  const user = Meteor.users.findOne(userId);
  const board = Boards.findOne({
    _id: boardId,
    $or: [
      { isPrivate: false },
      {
        users: {
          $elemMatch: {
            email: user.email(),
          },
        },
      },
    ],
  });

  if (!board) {
    return false;
  }

  return board.team().hasUser({ _id: userId });
};

Boards.addModuleInstance = (boardId, moduleInstanceId) => {
  // TODO: Add user is in board validation
  Boards.update({
    _id: boardId,
  }, {
    $push: {
      moduleInstances: {
        _id: moduleInstanceId,
      },
    },
  });
};

Boards.addUser = (boardId, userId) => {
  if (!Boards.isValid(boardId, Meteor.userId())) {
    throw new Meteor.Error('Boards.addUser.notInBoard',
    'Must be a member of a board to add users to it.');
  }

  const user = Meteor.users.findOne(userId);
  Boards.update(boardId, {
    $push: {
      users: {
        email: user.email(),
        notifications: 0,
      },
    },
  });
};

Boards.removeUser = (boardId, userId) => {
  const user = Meteor.users.findOne(userId);
  Boards.update(boardId, {
    $pull: {
      users: {
        email: user.email(),
      },
    },
  });
};

Boards.addNotification = (boardId, userId) => {
  const user = Meteor.users.findOne(userId);
  const users = Boards.findOne(boardId).users;

  users.forEach((_user, index) => {
    if (_user.email !== user.email()) {
      users[index].notifications = _user.notifications + 1;
    }
  });

  Boards.update(boardId, {
    $set: {
      users,
    },
  });
};

Boards.resetNotifications = (boardId, userId) => {
  const user = Meteor.users.findOne(userId);
  const users = Boards.findOne(boardId).users;

  users.forEach((_user, index) => {
    if (_user.email !== user.email()) {
      users[index].notifications = 0;
    }
  });

  Boards.update(boardId, {
    $set: {
      users,
    },
  });
};
