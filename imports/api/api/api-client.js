import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances/module-instances.js';

export let generateApi = (moduleInstanceId) => {
  return {
    subscribe: ({ request, callback }) => {
      // Validation.
      let validation = typeof request.collection == 'string';
      validation = validation && typeof request.condition == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        console.log(ModuleInstances.findOne(moduleInstanceId));
        Meteor.subscribe('moduleInstances.data', moduleInstanceId, request/*, {
          onReady: function() {
            let caller = (id, fields) => {
              callback(ModuleInstances.findOne(moduleInstanceId).fetch());
            };

            ModuleInstances.findOne(moduleInstanceId).observeChanges({
              added: caller,
              changed: caller,
              removed: caller,
            });
            callback('asd');
          },
          onError: (err) => {
            throw console.error('Error while subscribing.', err);
          },
        }*/);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    insert: ({ collection, obj, visibleBy }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof obj == 'object';
      validation = validation && typeof visibleBy == 'object';
      if (validation) {
        // Subscribe to data
        Meteor.subscribe('moduleInstances.data', moduleInstanceId, obj, {
          onReady: callback,
          onError: (err) => {
            throw console.error('Error while subscribing.', err);
          },
        });
        Meteor.call('ModuleInstances.methods.apiInsert', {
          moduleInstanceId: algo,

        });
      } else throw console.error('The provided data is wrong.');
    },
  };
};
