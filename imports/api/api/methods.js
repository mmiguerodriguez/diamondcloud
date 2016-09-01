import { Meteor }                              from 'meteor/meteor';
import { Random }                              from 'meteor/random';
import { ValidatedMethod }                     from 'meteor/mdg:validated-method';
import { SimpleSchema }                        from 'meteor/aldeed:simple-schema';
import Future                                  from 'fibers/future';

import { ModuleInstances, generateMongoQuery } from '../module-instances/module-instances.js';
import { ModuleData }                          from '../module-data/module-data.js';
import { Boards }                              from '../boards/boards.js';

let sift = require('sift'); // Query arrays with mongo api

export const apiInsert = new ValidatedMethod({
  name: 'API.methods.apiInsert',
  validate: new SimpleSchema({
    collectionId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    obj: { type: Object, blackbox: true },
    isGlobal: { type: Boolean },
    visibleBy: { type: [Object], blackbox: true },
  }).validator(),
  run({ collectionId, collection, obj, isGlobal, visibleBy }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('API.methods.apiInsert.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let mongoCollection = isGlobal ? ModuleData : ModuleInstances;
    let dataInstance = mongoCollection.findOne(collectionId);
    if (!isGlobal) {
      if (!Boards.isValid(dataInstance.board()._id, Meteor.user()._id)) {
        throw new Meteor.Error('API.methods.apiInsert.boardAccessDenied',
        'Must be part of a board to access its modules.');
      }
    }

    let entry = obj;
    if(!_.isEmpty(visibleBy)) {
      entry.visibleBy = visibleBy;
    }
    entry._id = (entry._id !== undefined) ? entry._id : Random.id();

    if (!dataInstance.data[collection]) dataInstance.data[collection] = [entry];
    else dataInstance.data[collection].push(entry);

    if (isGlobal) {
      ModuleData.update(collectionId, {
        $set: {
          data: dataInstance.data,
        }
      });
    } else {
      ModuleInstances.update(collectionId, {
        $set: {
          data: dataInstance.data,
        }
      });
    }
  }
});

export const apiUpdate = new ValidatedMethod({
  name: 'API.methods.apiUpdate',
  validate: new SimpleSchema({
    collectionId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
    updateQuery: { type: Object, blackbox: true },
  }).validator(),
  run({ collectionId, collection, filter, updateQuery }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('API.methods.apiInsert.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(collectionId);
    if (!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.apiInsert.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }

    let newCollection  = moduleInstance.data[collection];
    let boards = Meteor.user().boards(moduleInstance.board().team()._id, { _id: 1 }).fetch();
    boards = boards.map((board) => board._id);
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
        _id: collectionId,
        [`data.${collection}._id`]: element._id,
      }, generateMongoQuery(updateQuery, collection));
    });
  }
});

export const apiGet = new ValidatedMethod({
  name: 'API.methods.apiGet',
  validate: new SimpleSchema({
    collectionId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ collectionId, collection, filter }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('API.methods.apiGet.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(collectionId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.apiGet.boardAccessDenied',
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
  name: 'API.methods.apiRemove',
  validate: new SimpleSchema({
    collectionId: { type: String, regEx: SimpleSchema.RegEx.Id },
    collection: { type: String },
    filter: { type: Object, blackbox: true },
  }).validator(),
  run({ collectionId, collection, filter }) {
    if(!Meteor.user()) {
      throw new Meteor.Error('API.methods.apiRemove.notLoggedIn',
      'Must be logged in to use a module.');
    }
    let moduleInstance = ModuleInstances.findOne(collectionId);
    if(!Boards.isValid(moduleInstance.board()._id, Meteor.user()._id)) {
      throw new Meteor.Error('API.methods.apiRemove.boardAccessDenied',
      'Must be part of a board to access its modules.');
    }
    let future = new Future();
    let boards = Meteor.user().boards(moduleInstance.board().team()._id, { _id: 1 }).fetch();
    boards = boards.map((board) => board._id);
    filter = {
      $and: [
        {
          $or: [
            { 'visibleBy': { $exists: false } },
            { 'visibleBy.userId': Meteor.userId() },
            { 'visibleBy.boardId': { $in: boards } },
          ]
        },
        filter,
      ],
    };
    ModuleInstances.update(collectionId, {
      $pull: {
        [`data.${collection}`]: filter,
      }
    }, { multi: true }, (err, res) => {
      if(err) {
        throw new Meteor.Error('API.methods.apiRemove.queryError',
      'There was an error removing the entry.');
      } else {
        future.return(res);
      }
    });
    return future.wait();
  }
});
