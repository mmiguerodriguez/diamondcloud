import { Mongo }           from 'meteor/mongo';

import { Teams }           from '../teams/teams';
import { ModuleInstances } from '../module-instances/module-instances';

export let Boards = new Mongo.Collection('Boards');

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
    let moduleInstances = [];

    this.moduleInstances.map((moduleInstance) => {
      moduleInstances.push(moduleInstance._id);
    });

    return ModuleInstances.find({
      _id: {
        $in: moduleInstances,
      },
      archived: false,
    }, {
      fields
    });
  }
});

Boards.boardFields = {
  name: 1,
  isPrivate: 1,
  users: 1,
  drawings: 1,
  moduleInstances: 1,
  archived: 1,
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

Boards.getBoards = (boardsIds, userId, fields) => {
  fields = fields || {};
  if(Object.prototype.toString.call(boardsIds[0]) === "[object Object]"){
    boardsIds.forEach((board, index) => {
      boardsIds[index] = board._id;
    });
  }
  return Boards.find({
    $and: [
      {
        _id: {
          $in: boardsIds
        }
      },
      {
        $or: [
          {
            users: {
              $elemMatch: {
                _id: userId,
              }
            }
          },
          {
            isPrivate: false,
          },
        ],
      },
      { archived: false }
    ]
  }, {
    fields
  });
};
Boards.isValid = (boardId, userId) => {
  let board = Boards.findOne({
    _id: boardId,
    $or: [
      { isPrivate: false },
      {
        users: {
          $elemMatch: {
            _id: userId,
          }
        }
      }
    ],
  });

  if(!board) {
    return false;
  } else {
    return board.team().hasUser({ _id: userId });
  }
};
Boards.addModuleInstance = (boardId, moduleInstanceId) => {
  //todo: add user is in board validation
  Boards.update({
    _id: boardId,
  }, {
    $push: {
      moduleInstances: {
        _id: moduleInstanceId,
      }
    }
  });
};

Boards.addUser = (boardId, userId) => {
  if(!Boards.isValid(boardId, Meteor.userId())){
    throw new Meteor.Error('Boards.addUser.notInBoard',
    'Must be a member of a board to add users to it.');
  }
  Boards.update({ _id: boardId }, {
    $push: {
      users : {
        _id: userId,
        notifications: 0,
      },
    },
  });
};
Boards.removeUser = (boardId, userId) => {
  Boards.update({ _id: boardId }, {
    $pull: {
      users : {
        _id: userId,
      },
    },
  });
};

Boards.addNotification = (boardId, userId) => {
  let users = Boards.findOne(boardId).users;
  users.forEach((user, index, array) => {
    if(user._id === userId) {
      array[index].notifications = user.notifications + 1;
    }
  });

  Boards.update(boardId, {
    $set: {
      users,
    }
  });
};
Boards.resetNotifications = (boardId, userId) => {
	let users = Boards.findOne(boardId).users;
	users.forEach((user, index, array) => {
		if(user._id === userId) {
			array[index].notifications = 0;
		}
	});

	Boards.update(boardId, {
		$set: {
			users,
		}
	});
};
