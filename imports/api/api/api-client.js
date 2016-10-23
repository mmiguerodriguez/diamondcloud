import { Meteor }               from 'meteor/meteor';

import { Teams }                from '../teams/teams';
import { Boards }               from '../boards/boards';
import { ModuleInstances }      from '../module-instances/module-instances';
import { APICollection }        from '../api-collection/api-collection';

export const generateAPI = (moduleInstanceId) => {
  let subscriptions = [];
  const DiamondAPI = {
    subscribe({ collection, filter = {}, callback }) {
      let subscription;
      const subscriptionCallback = {
        onReady() {
          const moduleInstance = ModuleInstances.findOne(moduleInstanceId);
          const teamId = moduleInstance.board().team()._id;

          const query = APICollection.find({
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
                  },
                ],
              },
            ],
          });

          if (query.fetch().length === 0) {
            callback(undefined, query.fetch());
          }

          const caller = () => {
            // Check that the subscription is inside the subscriptions array
            const subscriptionIsAlive = subscriptions.find((_subscription) => {
              return _subscription.subscriptionId === subscription.subscriptionId;
            }) !== undefined;

            if (subscriptionIsAlive) {
              const updatedData = query.fetch();
              callback(undefined, updatedData);
            }
          };

          const handle = query.observeChanges({
            added: caller,
            changed: caller,
            removed: caller,
          });
        },
        onError(error) {
          throw new Meteor.Error(error);
        },
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
    update({ collection, filter = {}, updateQuery, callback }) {
      Meteor.call('API.methods.APIUpdate', {
        moduleInstanceId,
        collection,
        filter,
        updateQuery,
      }, callback);
    },
    get({ collection, filter = {}, callback }) {
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
          $in: this.getTeam().boards.map(board => board._id),
        },
      });
    },
    getUsers() {
      return this.getTeam().getUsers();
    },
    getBoard(boardId) {
      const team = this.getTeam();
      let result;

      team.boards.forEach((board) => {
        if (board._id === boardId) {
          result = Boards.findOne(boardId);
        }
      });

      return result;
    },
    getUser(userId) {
      // Validation
      const team = ModuleInstances.findOne(moduleInstanceId).board().team();

      if (!team.hasUser(userId)) {
        throw new Meteor.Error(`User ${userId} doesn't exist in this team.`);
      }

      // Return and error handling
      const user = Meteor.users.findOne(userId);

      if (user) {
        return user;
      }

      throw new Meteor.Error(`User ${userId} doesn't exist.`);
    },
    change(callback) {
      return 'This feature is not done yet. Sorry! :/';
    },
  };

  return DiamondAPI;
};
