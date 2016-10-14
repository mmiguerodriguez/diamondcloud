import { Meteor }               from 'meteor/meteor';

import { Teams }                from '../teams/teams.js';
import { Boards }               from '../boards/boards.js';
import { ModuleInstances }      from '../module-instances/module-instances.js';
import { APICollection }        from '../api-collection/api-collection.js';

export const generateApi = (moduleInstanceId) => {
  let subscriptions = [];
  let DiamondAPI = {
    subscribe({ collection, filter, callback }) {
      let subscription,
      subscriptionCallback = {
        onReady() {
          let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
          let teamId = moduleInstance.board().team()._id;

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

          if (query.fetch().length === 0) {
            callback(undefined, query.fetch());
          }

          let caller = () => {
            // Check that the subscription is inside the subscriptions array
            let subscriptionIsAlive = subscriptions.find((_subscription) => {
              return _subscription.subscriptionId === subscription.subscriptionId;
            }) !== undefined;
            console.log('SUBSCRIPTION IS ALIVE: ', subscriptionIsAlive);
            if (subscriptionIsAlive) {
              console.log('ARRAY DE SUBSCRIPTIONS: ', subscriptions);
              let updatedData = query.fetch();
              console.log('Esta es la collection de drive: ', updatedData);
              callback(undefined, updatedData);
            }
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

      subscription = Meteor.subscribe(
        'APICollection.data',
        moduleInstanceId,
        collection,
        filter,
        subscriptionCallback);
        

      subscriptions.push(subscription);

      return subscription;
    },
    unsubscribe() {
      subscriptions.forEach((subscription) => {
        subscription.stop();
      });
      subscriptions = [];
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
    getBoards() {
      return Boards.find({
        _id: {
          $in: this.getTeam().boards.map((board) => board._id)
        }
      });
    },
    getUsers() {
      return this.getTeam().getUsers();
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
