import { Meteor }             from 'meteor/meteor';

import { ModuleInstances }    from '../module-instances/module-instances.js';
import { APICollection }      from '../api-collection/api-collection.js';

export const generateApi = ({ moduleInstanceId, boards, users }) => {
  let subscriptions = [];
  let DiamondAPI = {
    subscribe({ collection, filter, callback }) {

    },
    unsubscribe(subscriptionId) {
      if (subscriptionId) {
        subscriptions.forEach((sub, index) => {
          if (sub.subscriptionId === subscriptionId) {
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
    insert({ collection, object, isGlobal, callback }) {
      Meteor.call('API.methods.APIInsert', {
        moduleInstanceId,
        collection,
        object,
        isGlobal,
      }, callback);
    },
    update({ collection, filter, updateQuery, callback }) {
      Meteor.call('API.methods.APIUpdate', {
        moduleInstanceId,
        collection,
        filter,
        updateQuery,
      }, callback);
    },
    get({ collection, filter, callback }) {
      Meteor.call('API.methods.APIGet', {
        moduleInstanceId,
        collection,
        filter,
      }, callback);
    },
    remove({ collection, filter, callback }) {
      Meteor.call('API.methods.APIRemove', {
        moduleInstanceId,
        collection,
        filter,
      }, callback);
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

  return DiamondAPI;
};
