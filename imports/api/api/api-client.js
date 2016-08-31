import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances/module-instances.js';

export let generateApi = ({ moduleInstanceId, boards, users }) => {
  console.log(boards, users);
  return {
    subscribe({ request, callback }) {
      // Validation.
      let validation = typeof request.collection == 'string';
      validation = validation && (typeof request.condition == 'object' || request.condition === undefined);
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        Meteor.subscribe('moduleInstances.data', moduleInstanceId, request);
        let query = ModuleInstances.find(moduleInstanceId);
        let caller = (id, fields) => {
          let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
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
    insert({ collection, obj, visibleBy, callback }) {
      // Validation.
      let validation = typeof collection == 'string' && collection.indexOf('commit_system') !== 0;
      validation = validation && typeof obj == 'object';
      validation = validation && typeof visibleBy == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('ModuleInstances.methods.apiInsert', {
          moduleInstanceId,
          collection,
          obj,
          visibleBy,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    update({ collection, filter, updateQuery, callback }) {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && typeof updateQuery == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('ModuleInstances.methods.apiUpdate', {
          moduleInstanceId,
          collection,
          filter,
          updateQuery,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    get({ collection, filter, callback }) {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('ModuleInstances.methods.apiGet', {
          moduleInstanceId,
          collection,
          filter,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    remove({ collection, filter, callback }) {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('ModuleInstances.methods.apiRemove', {
          moduleInstanceId,
          collection,
          filter,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    getTeamData() {
      return {
        boards,//todo: do not pass every property
        users,
      };
    },
    useCommitSystem(mergeFunction) {
      return {
        '#use_commit_system#': true,
        mergeFunction, 
      };
    },
  };
};

/*
Del lado del consumidor:
Si quiero que algún field de alguna collection use el commit system:
Le pongo como value DiamondAPI.useCommitSystem(mergeFunction)
Para gettear el value, lo veo normalmente (todos.field)
Para hacer un commit, hago DiamondAPI.commit({
  entryId /|id de la entry en la collection|/,
  collection,
  field,
  type/|in: insert, remove, change|/,
  value,
  position,
});
La mergeFunction
  @params: commits
  
  @returns: final version of the data

Del lado del server:
Cuando insertan un entry, se fija en los valores de todos los fields.
Para cada '#use_commit_system#' que encuentre:
Crea una collection con el nombre 'commit_system_collection.fieldName'
Cuando se llama a DiamondAPI.commit:
La collection 'commit_system_collection.fieldName' consiste en el siguiente objeto:
  'commit_system_collection.fieldName' : {
    merge: () => {},
    commits: [
      {
        entryId,
        type,
        value,
        position,
      },
    ],
  }

*/
