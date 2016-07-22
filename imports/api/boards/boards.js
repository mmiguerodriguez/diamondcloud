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