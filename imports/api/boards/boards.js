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
    }, { 
      fields: { 
        _id: 1 
      } 
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

  return Boards.find({
    _id: {
      $in: boardsIds 
    },
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
    archived: false,
  }, {
    fields
  });
};

Boards.isValid = (boardId, userId) => {
  return Boards.find({
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
  }).count() !== 0;
};