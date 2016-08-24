import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import Future              from 'fibers/future';

import { Boards }          from '../boards/boards.js';
import { ModuleInstances } from './module-instances.js';

export const createModuleInstance = new ValidatedMethod({
  name: 'ModuleInstances.methods.create',
  validate: new SimpleSchema({
    boardId: { type: String, regEx: SimpleSchema.RegEx.Id },
    moduleId: { type: String, regEx: SimpleSchema.RegEx.Id },
    x: { type: Number, min: 0 },
    y: { type: Number, min: 0 },
    width: { type: Number },
    height: { type: Number },
    vars: { type: Object },
  }).validator(),
  run({ boardId, moduleId, x, y, width, height, vars }){
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
      vars,
      archived: false,
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
  }).validator(),
  run({ moduleInstanceId, x, y, width, height }){
    if (!Meteor.user()) {
      throw new Meteor.Error('ModuleInstances.methods.edit.notLoggedIn',
      'Must be logged in to edit a module instance.');
    }

    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    x = x || moduleInstance.x;
    y = y || moduleInstance.y;
    width = width || moduleInstance.width;
    height = height || moduleInstance.height;

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
  run({ moduleInstanceId }){
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
