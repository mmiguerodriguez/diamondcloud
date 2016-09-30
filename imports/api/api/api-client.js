import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances/module-instances.js';
import { ModuleData } from '../module-data/module-data.js';

export const generateApi = ({ moduleInstanceId, boards, users }) => {
  let subscriptions = [];
  return {
    subscribe({ request, callback }) {
      let validation = typeof request.collection == 'string';
      validation = validation && (typeof request.condition == 'object' || request.condition === undefined);
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        let serverSubscriptionCallback = {
          onReady() {
            let moduleInstance = ModuleInstances.findOne(moduleInstanceId);

            let moduleData = ModuleData.findOne({
              teamId: moduleInstance.board().team()._id,
              moduleId: moduleInstance.moduleId
            });

            let query = ModuleData.find(moduleData._id);

            let caller = (id, fields) => {
              moduleData = ModuleData.findOne({
                teamId: moduleInstance.board().team()._id,
                moduleId: moduleInstance.moduleId
              });
  
              if (!!moduleData.data) {
                callback(undefined, moduleData.data[request.collection]);
              }
            };

            let handle = query.observeChanges({
              added: caller,
              changed: caller,
              removed: caller,
            });
          },
          onError: (err) => {
            callback(console.error('Server Error when trying to subscribe'), undefined);
          },
        };

        let subscription = Meteor.subscribe('moduleData.data',
                                            moduleInstanceId,
                                            request,
                                            serverSubscriptionCallback);

        subscriptions.push(subscription);
        return subscription;
      } else {
        callback(console.error('The provided data is wrong.'), undefined);
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
    insert({ collection, obj, isGlobal, visibleBy, callback }) {
      let validation = typeof collection == 'string';
      validation = validation && typeof obj == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiInsert', {
          moduleInstanceId,
          collection,
          obj,
          isGlobal,
          visibleBy,
        }, callback);
      } else {
        callback(console.error('The provided data is wrong.'), undefined);
      }
    },
    update({ collection, filter, updateQuery, callback }) {
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && typeof updateQuery == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiUpdate', {
          moduleInstanceId,
          collection,
          filter,
          updateQuery,
        }, callback);
      } else {
        callback(console.error('The provided data is wrong.'), undefined);
      }
    },
    get({ collection, filter, callback }) {
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiGet', {
          moduleInstanceId,
          collection,
          filter,
        }, callback);
      } else {
        callback(console.error('The provided data is wrong.'), undefined);
      }
    },
    remove({ collection, filter, callback }) {
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('API.methods.apiRemove', {
          moduleInstanceId,
          collection,
          filter,
        }, callback);
      } else {
        callback(console.error('The provided data is wrong.'), undefined);
      }
    },
    getTeamData() {
      return {
        boards, // TODO: do not pass every property
        users,
      };
    },
    getCurrentUser() {
      return Meteor.user();
    },
    getCurrentBoard() {
      return ModuleInstances.findOne(moduleInstanceId).board();
    },
  };
};
