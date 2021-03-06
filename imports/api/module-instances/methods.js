import { Meteor }          from 'meteor/meteor';
import { Random }          from 'meteor/random';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import Future              from 'fibers/future';

import { ModuleInstances } from './module-instances';
import { Boards }          from '../boards/boards';

export const createModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.create',
  validate: new SimpleSchema({
    boardId: { type: String, regEx: SimpleSchema.RegEx.Id },
    moduleId: { type: String /*, regEx: SimpleSchema.RegEx.Id*/ },
    x: { type: Number, min: 0 },
    y: { type: Number, min: 0 },
    width: { type: Number },
    height: { type: Number },
    archived: { type: Boolean, optional: true }
  }).validator(),
  run({ boardId, moduleId, x, y, width, height, data }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.create.notLoggedIn',
      'Must be logged in to make a module instance.');
    }
    let board = Boards.findOne(boardId);
    if (board.getModuleInstances().count() === 8) {
      throw new Meteor.Error('ModuleInstances.methods.create.limitExceeded',
      'The board already has reached the module limit.');
    }

    let moduleInstance = {
      moduleId,
      x,
      y,
      width,
      height,
      archived: false,
      minimized: false,
    };

    let future = new Future();
    ModuleInstances.insert(moduleInstance, (err, res) => {
      if (err) future.throw(err);

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

    if (x === undefined || x === null) x = moduleInstance.x;
    if (y === undefined || y === null) y = moduleInstance.y;

    width = width || moduleInstance.width;
    height = height || moduleInstance.height;
    minimized = minimized !== undefined ? minimized : moduleInstance.minimized;

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
