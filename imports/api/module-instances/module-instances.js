import { Mongo } from 'meteor/mongo';

import { Boards } from '../boards/boards.js';

export let ModuleInstances = new Mongo.Collection('ModuleInstances');

ModuleInstances.helpers({
  board(fields) {
    fields = fields || {};
    return Boards.findOne({
      'moduleInstances._id': this._id,
    }, { fields });
  }
});
