import { Meteor }                                from 'meteor/meteor';
import { Random }                                from 'meteor/random';
import { ValidatedMethod }                       from 'meteor/mdg:validated-method';
import { SimpleSchema }                          from 'meteor/aldeed:simple-schema';
import Future                                    from 'fibers/future';

import { printObject }                           from '../helpers/print-objects.js';

import { ModuleInstances }                       from '../module-instances/module-instances.js';
import { APICollection }                         from '../api-collection/api-collection.js';
import { Boards }                                from '../boards/boards.js';

export const APIInsert = new ValidatedMethod({
  name: 'API.methods.APIInsert',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    object: { type: Object, blackbox: true },
    isGlobal: { type: Boolean, optional: true },
  }).validator(),
  run({ moduleInstanceId, collection, object, isGlobal }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('API.methods.APIInsert.notLoggedIn',
      'Must be logged in to use a module.');
    }

    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    let teamId = moduleInstance.board().team()._id;

    if (!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.APIInsert.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }
    
    let entry = {
      ...APICollection.generateMongoQuery(object),
      collection,
    };
    
    if (!isGlobal) {
      entry.moduleInstanceId = moduleInstanceId;
    } else {
      entry.moduleId = moduleInstance.moduleId;
      entry.teamId = teamId;
    }
    
    APICollection.insert(entry);
    
    return entry;
  }
});

export const APIUpdate = new ValidatedMethod({
  name: 'API.methods.APIUpdate',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
    updateQuery: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter, updateQuery }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('API.methods.APIUpdate.notLoggedIn',
      'Must be logged in to use a module.');
    }

    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    let teamId = moduleInstance.board().team()._id;

    if (!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.APIUpdate.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    APICollection.update({
      $and: [
        filter,
        {
          collection,
        },
        {
          $or: [
            {
              moduleInstanceId,
            },
            {
              moduleId: moduleInstance.moduleId,
              teamId,
            }
          ]
        }
      ],
    },
    updateQuery);
  }
});

export const APIGet = new ValidatedMethod({
  name: 'API.methods.APIGet',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('API.methods.APIGet.notLoggedIn',
      'Must be logged in to use a module.');
    }

    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    let moduleData = ModuleData.findOne({
      teamId: moduleInstance.board().team()._id,
      moduleId: moduleInstance.moduleId
    });

    if (!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.APIGet.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let result  = moduleData.data[collection];
    let boards = Meteor.user()
                 .boards(moduleData.teamId, { _id: 1 })
                 .fetch()
                 .map((board) => board._id);
    let selected = sift({
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        {
          $or: [
            { 'isGlobal': true },
            { moduleInstanceId }
          ]
        },
        filter
      ]
    }, result);
    return selected;
  }
});

export const APIRemove = new ValidatedMethod({
  name: 'API.methods.APIRemove',
  validate: new SimpleSchema({
    moduleInstanceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ moduleInstanceId, collection, filter }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('API.methods.APIRemove.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
    let moduleData = ModuleData.findOne({
      teamId: moduleInstance.board().team()._id,
      moduleId: moduleInstance.moduleId
    });

    if (!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.APIRemove.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let boards = Meteor.user()
                 .boards(moduleData.teamId, { _id: 1 })
                 .fetch()
                 .map((board) => board._id);

    filter = {
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        {
          $or: [
            { 'isGlobal': true },
            { moduleInstanceId }
          ]
        },
        filter,
      ],
    };

    let future = new Future();
    ModuleData.update(moduleData._id, {
      $pull: {
        [`data.${collection}`]: filter,
      }
    }, { multi: true }, (err, res) => {
      if (err) {
        throw new Meteor.Error('API.methods.APIRemove.queryError',
      'There was an error removing the entry.');
      } else {
        future.return(res);
      }
    });

    return future.wait();
  }
});
