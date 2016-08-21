export let generateApi = (moduleInstanceId) => {
  return {
    subscribe: (obj, callback) => {
      // Validation.
      //cosa
      let validation = typeof obj.collection == 'string';
      validation = validation && typeof obj.condition == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        Meteor.subscribe('moduleInstances.data', moduleInstanceId, obj, {
          onReady: callback,
          onError: (err) => {
            throw console.error('Error while subscribing.', err);
          },
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
    /*update: ({ collection, filter, updateQuery, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && typeof updateQuery == 'object';
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
    },*/
  };
};
