import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ModuleInstances } from './module-instances.js';
import { Boards } from '../boards/boards.js';

export const createModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.create',
  validate: new SimpleSchema({
    moduleId: { type: String, regEx: SimpleSchema.RegEx.Id },
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    data: { type: Object },
  }).validator(),
  run({ moduleId, x, y, width, height, data }){
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
    };

    ModuleInstances.insert(moduleInstance);

    return ModuleInstances.findOne();
  }
});

export const editModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.edit',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    x: { type: Number, optional: true },
    y: { type: Number, optional: true },
    width: { type: Number, optional: true },
    height: { type: Number, optional: true },
  }).validator(),
  run({ moduleInstanceId, x, y, width, height }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.edit.notLoggedIn',
      'Must be logged in to edit a module instance.');
    }

    ModuleInstances.update(moduleInstanceId, {
      $set: {
        x,
        y,
        width,
        height,
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
    entry.visibleBy = visibleBy;

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
    entry.visibleBy = visibleBy;

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
