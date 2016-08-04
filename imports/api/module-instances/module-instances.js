import { Mongo } from 'meteor/mongo';

import { Boards } from '../boards/boards.js';

export let ModuleInstances = new Mongo.Collection('ModuleInstances');

ModuleInstances.helpers({
  board() {
    return Boards.findOne({
      moduleInstances: {
        $elemMatch: {
          _id: this._id,
        },
      },
    });
  }
});
