import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances/module-instances.js';

export let generateApi = ({ moduleInstanceId, boards, users }) => {
  let subscriptions = [];

  return {
    subscribe: ({ request, callback }) => {
      // Validation.
      let validation = typeof request.collection == 'string';
      validation = validation && (typeof request.condition == 'object' || request.condition === undefined);
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        let subscription = Meteor.subscribe('moduleInstances.data', moduleInstanceId, request);
        let query = ModuleInstances.find(moduleInstanceId);
        let caller = (id, fields) => {
          let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
          if(moduleInstance) {
            if(moduleInstance.data !== undefined && moduleInstance.data !== null) {
              callback(moduleInstance.data);
            }
          }
        };
        let handle = query.observeChanges({
          added: caller,
          changed: caller,
          removed: caller,
        });

        subscriptions.push(subscription);
        return subscription.subscriptionId;
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    unsubscribe(subscriptionId) {
      if(subscriptionId) {
        subscriptions.forEach((sub, index) => {
          if(sub.subscriptionId === subscriptionId) {
            sub.stop();
            subscriptions.splice(index, 1);
          }
        });
      } else {
        subscriptions.forEach((sub, index) => {
          sub.stop();
          subscriptions.splice(index, 1);
        });
      }
    },
    insert: ({ collection, obj, visibleBy, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
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
    update: ({ collection, filter, updateQuery, callback }) => {
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
    get: ({ collection, filter, callback }) => {
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
    remove: ({ collection, filter, callback }) => {
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
    getTeamData: () => {
      return {
        boards,//todo: do not pass every property
        users,
      };
    }
  };
};
