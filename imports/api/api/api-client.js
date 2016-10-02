import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances/module-instances.js';
import { ModuleData } from '../module-data/module-data.js';

export const generateApi = ({ moduleInstanceId, boards, users }) => {
  let subscriptions = [];
  let DiamondAPI = {
    subscribe({ collection, filter, callback }) {
      let oldRes;
      let recursiveGet = () => {
        DiamondAPI.get({
          collection,
          filter,
          callback: (err, res) => {
            if (!_.isEqual(res, oldRes)) {
              oldRes = res;
              callback(err, res);
            }
            setTimeout(recursiveGet, 1000);
          },
        });
      };

      recursiveGet();
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

  return DiamondAPI;
};

// Copyright (c) 2016 Copyright Diamond All Rights Reserved.
