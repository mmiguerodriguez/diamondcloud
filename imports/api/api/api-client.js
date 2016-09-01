import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances/module-instances.js';
import { ModuleData } from '../module-data/module-data.js';

export let generateApi = ({ collectionId, boards, users }) => {
  return {
    subscribe: ({ request, callback }) => {
      // Validation.
      let validation = typeof request.collection == 'string';
      validation = validation && (typeof request.condition == 'object' || request.condition === undefined);
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        Meteor.subscribe('moduleInstances.data', collectionId, request);
        let query = ModuleInstances.find(collectionId);
        let caller = (id, fields) => {
          let moduleInstance = ModuleInstances.findOne(collectionId);
          if (moduleInstance.data !== undefined && moduleInstance.data !== null) {
            callback(moduleInstance.data);
          }
        };
        let handle = query.observeChanges({
          added: caller,
          changed: caller,
          removed: caller,
        });
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    insert: ({ collection, obj, visibleBy, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof obj == 'object';
      validation = validation && typeof visibleBy == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {

        Meteor.call('API.methods.apiInsert', {
          collectionId,
          collection,
          obj,
          visibleBy,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    update: ({ collection, filter, updateQuery, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && typeof updateQuery == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiUpdate', {
          collectionId,
          collection,
          filter,
          updateQuery,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    get: ({ collection, filter, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiGet', {
          collectionId,
          collection,
          filter,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    remove: ({ collection, filter, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiRemove', {
          collectionId,
          collection,
          filter,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    getTeamData: () => {
      return {
        boards,//todo: do not pass every property
        users,
      };
    }
  };
};
