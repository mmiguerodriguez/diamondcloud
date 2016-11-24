import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import { printObject }          from '../helpers/print-objects.js';
import   faker                  from 'faker';
import                               '../factories/factories.js';

import { Teams }                from '../teams/teams.js';
import { Boards }               from '../boards/boards.js';
import { ModuleInstances }      from '../module-instances/module-instances.js';
import { APICollection }        from '../api-collection/api-collection.js';

import { generateAPI }          from './api-client.js';

if (Meteor.isClient) {
  describe('API', () => {
    describe('Subscriptions', () => {
      let user,
          weirdUser,
          teams,
          boards,
          modules,
          moduleInstances,
          collections,
          documents,
          DiamondAPI,
          params,
          callback,
          subscribeInput,
          subscribeResult,
          insertParams,
          updateParams,
          getParams,
          removeParams;

      beforeEach(function() {
        user = Factory.create('user');

        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];

        boards = [
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard', { name: 'General' }),
        ];

        modules = [
          { _id: Random.id() },
          { _id: Random.id() },
        ];

        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];

        collections = [
          faker.lorem.word(),
          faker.lorem.word(),
        ];

        documents = [];
        for (let i = 0; i < 5; i++) {
          documents.push(Factory.create('spamAPIDocument'));
        }

        DiamondAPI = generateAPI(moduleInstances[0]._id);

        insertParams = {
          collection: collections[0],
          object: documents[0],
          isGlobal: false,
          callback: () => 729,
        };

        updateParams = {
          collection: collections[0],
          filter: {},
          updateQuery: {
            $set: {
              something: faker.lorem.word(),
            },
          },
          callback: () => Math.PI,
        };

        getParams = {
          collection: collections[0],
          filter: {},
          callback: () => 2,
        };

        removeParams = {
          collection: collections[0],
          filter: {},
          callback: () => () => 4
        };

        subscribeInput = {
          collection: collections[0],
          filter: {},
          callback: () => 4,
        };

        // Add user to teams
        teams[0].users[0].email = user.emails[0].address;
        teams[0].users[0].permission = 'member';
        teams[1].users[0].email = user.emails[0].address;
        teams[1].users[0].permission = 'member';

        // Assign boards to teams
        teams[0].boards.push({ _id: boards[0]._id });
        teams[0].boards.push({ _id: boards[1]._id });
        teams[1].boards.push({ _id: boards[2]._id });

        // Assign module instances to boards
        boards[0].moduleInstances.push({ _id: moduleInstances[0]._id });
        boards[0].moduleInstances.push({ _id: moduleInstances[1]._id });
        boards[1].moduleInstances.push({ _id: moduleInstances[2]._id });
        boards[2].moduleInstances.push({ _id: moduleInstances[3]._id });

        // Assign modules to module instances
        moduleInstances[0].moduleId = modules[0]._id;
        moduleInstances[1].moduleId = modules[1]._id;
        moduleInstances[2].moduleId = modules[0]._id;
        moduleInstances[3].moduleId = modules[1]._id;

        // Assign (module && team) || module instance to documents
        documents[0]['#moduleId'] = modules[0]._id;
        documents[0]['#teamId'] = teams[0]._id;
        documents[1]['#moduleId'] = modules[0]._id;
        documents[1]['#teamId'] = teams[0]._id;
        documents[2]['#moduleInstanceId'] = moduleInstances[1]._id;
        documents[3]['#moduleInstanceId'] = moduleInstances[0]._id;
        documents[4]['#moduleInstanceId'] = moduleInstances[3]._id;

        // Assign collections to documents
        documents[0]['#collection'] = collections[0];
        documents[1]['#collection'] = collections[0];
        documents[2]['#collection'] = collections[0];
        documents[3]['#collection'] = collections[1];
        documents[4]['#collection'] = collections[1];

        Meteor.users.insert(user);

        sinon.stub(Meteor, 'user', () => user);

        sinon.stub(Meteor.users, 'findOne', () => user);

        sinon.stub(Meteor, 'subscribe', (
          subName,
          moduleInstanceId,
          collection,
          filter,
          subscriptionCallback
        ) => {
          subscribeResult = {
            moduleInstanceId,
            collection,
            filter,
          };
        });

        sinon.stub(Meteor, 'call', (methodName, callParams, callCallback) => {
          callback = callCallback;
          params = callParams;
        });

        sinon.stub(ModuleInstances, 'findOne', (moduleInstanceId) => {
          let result = _.clone(moduleInstances[0]);

          result.board = () => {
            let boardResult = _.clone(boards[0]);

            boardResult.team = () => {
              let teamResult = _.clone(teams[0]);
              teamResult.hasUser = () => true;
              teamResult.getUsers = () => [user];
              return teamResult;
            };

            return boardResult;
          };

          return result;
        });

        sinon.stub(Boards, 'findOne', () => boards[0]);

        sinon.stub(Boards, 'find', () => [boards[0], boards[1]]);
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.users.findOne.restore();
        Meteor.subscribe.restore();
        Meteor.call.restore();
        ModuleInstances.findOne.restore();
        Boards.findOne.restore();
        Boards.find.restore();
      });

      it('should get the requested data when subscribing', (done) => {
        DiamondAPI.subscribe(subscribeInput);
        delete subscribeInput.callback;
        subscribeInput.moduleInstanceId = moduleInstances[0]._id;
        chai.assert.deepEqual(subscribeInput, subscribeResult);
        done();
      });

      it('should insert an API entry', (done) => {
        DiamondAPI.insert(insertParams);
        chai.assert.equal(callback.toString(), insertParams.callback.toString());
        delete insertParams.callback;
        insertParams.moduleInstanceId = moduleInstances[0]._id;
        chai.assert.deepEqual(insertParams, params);
        done();
      });

      it('should update the requested API entries', (done) => {
        DiamondAPI.update(updateParams);
        chai.assert.equal(callback.toString(), updateParams.callback.toString());
        delete updateParams.callback;
        updateParams.moduleInstanceId = moduleInstances[0]._id;
        chai.assert.deepEqual(updateParams, params);
        done();
      });

      it('should get the requested API entries', (done) => {
        DiamondAPI.get(getParams);
        chai.assert.equal(callback.toString(), getParams.callback.toString());
        delete getParams.callback;
        getParams.moduleInstanceId = moduleInstances[0]._id;
        chai.assert.deepEqual(getParams, params);
        done();
      });

      it('should remove the requested API entries', (done) => {
        DiamondAPI.remove(removeParams);
        chai.assert.equal(callback.toString(), removeParams.callback.toString());
        delete removeParams.callback;
        removeParams.moduleInstanceId = moduleInstances[0]._id;
        chai.assert.deepEqual(removeParams, params);
        done();
      });

      it('should return the current user', (done) => {
        chai.assert.equal(DiamondAPI.getCurrentUser(), user);
        done();
      });

      it('should return the current board', (done) => {
        let res = DiamondAPI.getCurrentBoard();
        delete res.team;
        delete res.getModuleInstances;
        delete res.getMessages;
        delete res.getLastMessage;
        delete res.getNotifications;
        delete res.getUsers;
        chai.assert.equal(JSON.stringify(res), JSON.stringify(boards[0]));
        done();
      });

      it('should get logged users', (done) => {
        // Feature not done
        done();
      });

      it('should get the current team', (done) => {
        let res = DiamondAPI.getTeam();
        delete res.owner;
        delete res.hasUser;
        delete res.getUsers;
        chai.assert.equal(JSON.stringify(res), JSON.stringify(teams[0]));
        done();
      });

      it('should get all boards of the team', (done) => {
        let boards = DiamondAPI.getBoards();
        chai.assert.deepEqual(boards, [boards[0], boards[1]]);
        done();
      });

      it('should get all users of the team', (done) => {
        let users = DiamondAPI.getUsers();
        chai.assert.deepEqual(users, [user]);
        done();
      });

      it('should get the requested board', (done) => {
        let res = DiamondAPI.getBoard(boards[0]._id);
        chai.assert.deepEqual(res, boards[0]);
        done();
      });

      it('should get the requested user', (done) => {
        chai.assert.deepEqual(DiamondAPI.getUser(user._id), user);
        done();
      });

      it('should call respective callbacks on each change', (done) => {
        // Feature not done
        done();
      });
    });
  });
}
