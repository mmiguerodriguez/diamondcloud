import { Meteor }                              from 'meteor/meteor';
import { Random }                              from 'meteor/random';
import { ValidatedMethod }                     from 'meteor/mdg:validated-method';
import { SimpleSchema }                        from 'meteor/aldeed:simple-schema';
import Future                                  from 'fibers/future';

import { ModuleInstances, generateMongoQuery } from './module-instances.js';
import { Boards }                              from '../boards/boards.js';

let sift = require('sift'); // Query arrays with mongo api

export const createModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.create',
  validate: new SimpleSchema({
    boardId: { type: String, regEx: SimpleSchema.RegEx.Id },
    moduleId: { type: String, regEx: SimpleSchema.RegEx.Id },
    x: { type: Number, min: 0 },
    y: { type: Number, min: 0 },
    width: { type: Number },
    height: { type: Number },
    data: { type: Object, blackbox: true },
    archived: { type: Boolean, optional: true }
  }).validator(),
  run({ boardId, moduleId, x, y, width, height, data }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.create.notLoggedIn',
      'Must be logged in to make a module instance.');
    }

    let moduleInstance = {
      moduleId,
      x,
      y,
      width,
      height,
      data,
      archived: false,
      minimized: false,
    };

    let future = new Future();
    ModuleInstances.insert(moduleInstance, (err, res) => {
      if(err) future.throw(err);

      let moduleInstanceId = res;
      Boards.addModuleInstance(boardId, moduleInstanceId);

      let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
      future.return(moduleInstance);
    });
    return future.wait();
  }
});

export const editModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.edit',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    x: { type: Number, min: 0, optional: true },
    y: { type: Number, min: 0, optional: true },
    width: { type: Number, optional: true },
    height: { type: Number, optional: true },
    minimized: { type: Boolean, optional: true },
  }).validator(),
  run({ moduleInstanceId, x, y, width, height, minimized }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.edit.notLoggedIn',
      'Must be logged in to edit a module instance.');
    }

    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    x = x || moduleInstance.x;
    y = y || moduleInstance.y;
    width = width || moduleInstance.width;
    height = height || moduleInstance.height;
    minimized = minimized != undefined ? minimized : moduleInstance.minimized;
    
    ModuleInstances.update(moduleInstanceId, {
      $set: {
        x,
        y,
        width,
        height,
        minimized,
      }
    });

    return ModuleInstances.findOne(moduleInstanceId);
  }
});

export const archiveModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.archive',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ moduleInstanceId }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.archive.notLoggedIn',
      'Must be logged in to archive a module instance.');
    }

    ModuleInstances.update(moduleInstanceId, {
      $set: {
        archived: true,
      }
    });

    return ModuleInstances.findOne(moduleInstanceId);
  }
});

export const dearchiveModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.dearchive',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ moduleInstanceId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.dearchive.notLoggedIn',
      'Must be logged in to dearchive a module instance.');
    }

    ModuleInstances.update(moduleInstanceId, {
      $set: {
        archived: false,
      }
    });

    return ModuleInstances.findOne(moduleInstanceId);
  }
});

export const apiInsert = new ValidatedMethod({
  name: 'ModuleInstances.methods.apiInsert',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    obj: { type: Object, blackbox: true },
    visibleBy: { type: [Object], blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, obj, visibleBy }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.apiInsert.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('ModuleInstances.methods.apiInsert.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let entry = obj;
    if(!_.isEmpty(visibleBy)) {
      entry.visibleBy = visibleBy;
    }
    entry._id = (entry._id !== undefined) ? entry._id : Random.id();

    if(!moduleInstance.data[collection]){
      moduleInstance.data[collection] = [entry];
    }
    else{
      moduleInstance.data[collection].push(entry);
    }

    ModuleInstances.update(moduleInstanceId, {
      $set: {
        data: moduleInstance.data,
      }
    });
  }
});

export const apiUpdate = new ValidatedMethod({
  name: 'ModuleInstances.methods.apiUpdate',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
    updateQuery: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter, updateQuery }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.apiInsert.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('ModuleInstances.methods.apiInsert.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let newCollection  = moduleInstance.data[collection];
    let boards = Meteor.user().boards(moduleInstance.board().team()._id, { _id: 1 }).fetch();
    boards.forEach((element, index) => {
      boards[index] = element._id;
    });
    let selected = sift({
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        filter
      ]
    }, newCollection);
    selected.forEach((element) => {
      ModuleInstances.update({
        _id: moduleInstanceId,
        [`data.${collection}._id`]: element._id,
      }, generateMongoQuery(updateQuery, collection));
    });
  }
});

export const apiGet = new ValidatedMethod({
  name: 'ModuleInstances.methods.apiGet',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.apiGet.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('ModuleInstances.methods.apiGet.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let result  = moduleInstance.data[collection];
    let boards = Meteor.user().boards(moduleInstance.board().team()._id, { _id: 1 }).fetch();
    boards.forEach((element, index) => {
      boards[index] = element._id;
    });
    let selected = sift({
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        filter
      ]
    }, result);
    return selected;
  }
});
export const apiRemove = new ValidatedMethod({
  name: 'ModuleInstances.methods.apiRemove',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.apiRemove.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('ModuleInstances.methods.apiRemove.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }
    let future = new Future();
    let boards = Meteor.user().boards(moduleInstance.board().team()._id, { _id: 1 }).fetch();
    boards.forEach((element, index) => {
      boards[index] = element._id;
    });
    filter = {
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        filter
      ],
    };
    ModuleInstances.update(moduleInstanceId, {
      $pull: {
        [`data.${collection}`]: filter,
      }
    }, { multi: true }, (err, res) => {
      if(err) {
        throw new Meteor.Error('ModuleInstances.methods.apiRemove.queryError',
      'There was an error removing the entry.');
      } else {
        future.return(res);
      }
    });
    return future.wait();
  }
});
