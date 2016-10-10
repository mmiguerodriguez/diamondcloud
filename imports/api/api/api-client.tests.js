import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { printObject }          from '../helpers/print-objects.js';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               '../factories/factories.js';

import { Teams }                from '../teams/teams.js';
import { Boards }               from '../boards/boards.js';
import { ModuleInstances }      from '../module-instances/module-instances.js';
import { APICollection }        from '../api-collection/api-collection.js';

import { generateApi }          from './api-client.js';

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
          DiamondAPI;

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

        DiamondAPI = generateApi(moduleInstances[0]._id);

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

        });

        sinon.stub(Meteor, 'call', (methodName) => {
          // Work with the arguments array
        });

        sinon.stub(ModuleInstances, 'findOne', (moduleInstanceId) => {
          let result = _.clone(moduleInstances[0]);

          result.board = () => {
            let boardResult = _.clone(boards[0]);

            boardResult.team = () => {
              let teamResult = _.clone(teams[0]);
              teamResult.hasUser = () => true;
              return teamResult;
            };

            return boardResult;
          };

          return result;
        });

        sinon.stub(Boards, 'findOne', (boardId) => {
          let result;

          boards.forEach((board) => {
            if (board._id == boardId) {
              result = board;
            }
          });

          return result;
        });
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.users.findOne.restore();
        Meteor.subscribe.restore();
        Meteor.call.restore();
        ModuleInstances.findOne.restore();
        Boards.findOne.restore();
      });

      it('should get the requested data when subscribing', (done) => {
        done();
      });

      it('should insert object to a module instance data', (done) => {
        done();
      });

      it('should update an entry in module instance data', (done) => {
        done();
      });

      it('should get an entry in module instance data', (done) => {
        done();
      });

      it('should return the current user', (done) => {
        chai.assert.deepEqual(DiamondAPI.getCurrentUser(), user);
        done();
      });

      it('should return the current board', (done) => {
        let board = boards[0];
        chai.assert.deepEqual(DiamondAPI.getCurrentBoard(), board);
        done();
      });

      it('should get logged users', (done) => {
        // Feature not done
        done();
      });

      it('should get the current team', (done) => {
        printObject('Shikaka', DiamondAPI.getTeam());
        //chai.assert.deepEqual(DiamondAPI.getTeam(), teams[0]);
        done();
      });

      it('should get the requested board', (done) => {
        chai.assert.deepEqual(DiamondAPI.getBoard(boards[0]._id), boards[0]);
        chai.assert.deepEqual(DiamondAPI.getBoard(boards[1]._id), boards[1]);
        chai.assert.deepEqual(DiamondAPI.getBoard(boards[2]._id), undefined);
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
