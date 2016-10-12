import { Meteor }               from 'meteor/meteor';

import { printObject }          from '../helpers/print-objects.js';

import { Teams }                from '../teams/teams.js';
import { Boards }               from '../boards/boards.js';
import { ModuleInstances }      from '../module-instances/module-instances.js';
import { APICollection }        from '../api-collection/api-collection.js';

export const generateApi = (moduleInstanceId) => {
  let subscriptions = [];
  let DiamondAPI = {
    subscribe({ collection, filter, callback }) {
      let subscriptionCallback = {
        onReady() {
          console.log('Suscribed');
          let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
          let teamId = moduleInstance.board().team();
  
          let query = APICollection.find({
            $and: [
              {
                '#collection': collection,
              },
              filter,
              {
                $or: [
                  {
                    '#moduleInstanceId': moduleInstanceId,
                  },
                  {
                    '#moduleId': moduleInstance.moduleId,
                    '#teamId': teamId,
                  }
                ]
              }
            ],
          });
          
          let caller = (id, fields) => {
            callback(undefined, fields);
          };
  
          let handle = query.observeChanges({
            added: caller,
            changed: caller,
            removed: caller,
          });
        },
        onError(err) {
          console.log('Suscription error');
          throw new console.error(err);
        }
      };

      let subscription = Meteor.subscribe(
      'APICollection.data',
      moduleInstanceId,
      collection,
      filter,
      subscriptionCallback);

      return subscription;
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
      return this.getCurrentBoard().team();
    },
    getBoard(boardId) {
      let team = this.getTeam();
      let result;

      team.boards.forEach((board) => {
        if (board._id == boardId) {
          result = Boards.findOne(boardId);
        }
      });

      return result;
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
