import { Mongo } from 'meteor/mongo';

import { Teams } from '../teams/teams';

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
});

Boards.boardFields = {
  name: 1,
  isPrivate: 1,
  users: 1,
  drawings: 1,
  archived: 1,
};

Boards.getBoards = (boardsIds, userId, fields) => {
  fields = fields || { _id: 1, name: 1 };
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
  if(!board){
    return false;
  }
  else{
    return board.team().hasUser({ _id: userId });
  }
};
