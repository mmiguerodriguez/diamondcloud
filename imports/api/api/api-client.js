import { Meteor }             from 'meteor/meteor';

import { ModuleInstances }    from '../module-instances/module-instances.js';
import { APICollection }      from '../api-collection/api-collection.js';

export const generateApi = ({ moduleInstanceId, boards, users }) => {
  let subscriptions = [];
  let DiamondAPI = {
    subscribe({ collection, filter, callback }) {
      // TODO: Start and finish this.
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
    getCurrentUser() {
      return Meteor.user();
    },
    getCurrentBoard() {
      return ModuleInstances.findOne(moduleInstanceId).board();
    },
    getLoggedUsers() {
      return 'This feature is not done yet. Sorry! :/';
    },
    getTeam() {
      return ModuleInstances.findOne(moduleInstanceId).board().team();
    },
    getBoard() {
      return ModuleInstances.findOne(moduleInstanceId).board();
    },
    getUser(userId) {
      // Validation
      let team = ModuleInstances.findOne(moduleInstanceId).board().team();

      if (!team.hasUser(userId)) {
        throw new console.error(`User ${userId} doesn't exist in this team.`);
      }

      // Return and error handling
      let user = Meteor.users.findOne(userId);

      if (!!user) {
        return user;
      } else {
        throw new console.error(`User ${userId} doesn't exist.`);
      }
    },
    change(callback) {
      return 'This feature is not done yet. Sorry! :/';
    }
  };

  return DiamondAPI;
};
