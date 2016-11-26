import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { printObject }   from '../helpers/print-objects.js';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Boards }          from './boards.js';
import { Teams }           from '../teams/teams.js';
import { Messages }        from '../messages/messages';
import { Hierarchies }     from '../hierarchies/hierarchies';
import { BoardTypes }      from '../board-types/board-types';
import { ModuleInstances } from '../module-instances/module-instances.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    describe('Helpers', function() {
      let teams, boards, users, messages, moduleInstances, findRequest, hierarchy, boardType;
      function getNotifications(boardId, userId) {
        let user = Meteor.users.findOne(userId);
        return Boards.findOne(boardId).users.find((_user) => {
          return _user.email !== user.email();
        }).notifications;
      }

      beforeEach(function() {
        resetDatabase();

        users = [
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }]}),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }]}),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }]}),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }]}),
        ];

        teams = [
          Factory.create('team'),
          Factory.create('team'),
          Factory.create('team'),
        ];

        boards = [
          Factory.create('board'),
          Factory.create('board'),
          Factory.create('board'),
          Factory.create('board'),
          Factory.create('board', { visibleForDirectors: true }),
        ];

        messages = [];
        for (let i = 0; i < 3; i++) {
          messages.push(Factory.create('boardMessage'));
          messages[i].boardId = boards[0]._id;
        }

        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];

        hierarchy = Factory.create('hierarchy');
        hierarchy.permissions = ['accessVisibleBoards'];

        boardType = Factory.create('boardType');
        boardType.boardTypeProperties = ['isPrivate'];

        teams[0].users.push({ email: users[0].emails[0].address, hierarchy: 'sistemas' });
        teams[0].boards.push({ _id: boards[0]._id });
        teams[1].users.push({ email: users[0].emails[0].address, hierarchy: 'sistemas' });

        boards[0].boardType.push({ boardType });
        boards[0].users.push({ email: users[0].emails[0].address, notifications: faker.random.number({ min: 1, max: 20 }) });
        boards[0].users.push({ email: users[1].emails[0].address, notifications: faker.random.number({ min: 1, max: 20 }) });
        boards[2].moduleInstances.push({ _id: moduleInstances[0]._id });

        teams[2].boards.push({ _id: boards[3]._id });
        teams[2].boards.push({ _id: boards[4]._id });

        teams[2].users = [];
        teams[2].users.push({ email: users[2].emails[0].address, hierarchy: 'creativos' });
        teams[2].users.push({ email: users[3].emails[0].address, hierarchy: hierarchy._id });

        boards[3].users.push({ email: users[2].emails[0].address });

        resetDatabase();

        users.forEach((user) => {
          Meteor.users.insert(user);
        });

        boards.forEach((board) => {
          Boards.insert(board);
        });

        teams.forEach((team) => {
          Teams.insert(team);
        });

        moduleInstances.forEach((moduleInstance) => {
          ModuleInstances.insert(moduleInstance);
        });

        messages.forEach((message) => {
          Messages.insert(message);
        });

        Hierarchies.insert(hierarchy);

        BoardTypes.insert(boardType);

        sinon.stub(Meteor, 'user', () => users[0]);
        sinon.stub(Meteor, 'userId', () => users[0]._id);
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
      });

      it('should return the team of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let team = board.team();
        chai.assert.equal(team._id, teams[0]._id);
      });

      it('should not return the team of a board', function() {
        let board = Boards.findOne(boards[1]._id);
        let team = board.team();
        chai.assert.isUndefined(team);
      });

      it('should return the messages of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        chai.assert.equal(board.getMessages().count(), messages.length);
      });

      it('should return the moduleInstances of a board', function() {
        let board = Boards.findOne(boards[2]._id);
        let result, expect;

        result = board.getModuleInstances(Boards.moduleInstancesFields).fetch()[0];
        expect = moduleInstances[0];

        chai.assert.equal(expect._id, result._id);
        chai.assert.equal(expect.moduleId, result.moduleId);
        chai.assert.equal(expect.x, result.x);
        chai.assert.equal(expect.y, result.y);
        chai.assert.equal(expect.width, result.width);
        chai.assert.equal(expect.height, result.height);
        chai.assert.equal(expect.archived, result.archived);
        chai.assert.isUndefined(result.data);
      });

      it('should return the last message from a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let lastMessage = board.getLastMessage();
        let expectMessage = messages[2];

        chai.assert.deepEqual(lastMessage, expectMessage);
      });

      it('should return user notifications from the board', function() {
        let board = Boards.findOne(boards[0]._id);
        let notifications = board.getNotifications();
        let expectNotifications = boards[0].users[0].notifications;

        chai.assert.deepEqual(notifications, expectNotifications);
      });

      it('should return the boardType of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let boardType = board.getBoardType();
        let expectBoardType = [boardType[0]];

        chai.assert.equal(boardType, expectBoardType);
      });

      it('should add a user to a board', function() {
        let expect = boards[0];

        expect.users.push({
          email: users[1].emails[0].address,
          notifications: 0,
        });

        Boards.addUser(boards[0]._id, users[1]._id);
        chai.assert.deepEqual(Boards.findOne(boards[0]._id), expect);
      });

      it('should remove a user from a board', function() {
        let expect = boards[0];
        expect.users = [boards[0].users[1]];
        Boards.removeUser(boards[0]._id, users[0]._id);
        chai.assert.deepEqual(Boards.findOne(boards[0]._id), expect);
      });

      it('should add a notification of user board', function() {
        let startNotifications, endNotifications;

        startNotifications = getNotifications(boards[0]._id, users[0]._id);
        Boards.addNotification(boards[0]._id, users[0]._id);
        endNotifications = getNotifications(boards[0]._id, users[0]._id);

        chai.assert.notEqual(startNotifications, endNotifications);
        chai.assert.equal(startNotifications + 1, endNotifications);
      });

      it('should reset notifications of user board', function() {
        let startNotifications, endNotifications;

        startNotifications = getNotifications(boards[0]._id, users[0]._id);
        Boards.resetNotifications(boards[0]._id, users[0]._id);
        endNotifications = getNotifications(boards[0]._id, users[0]._id);

        chai.assert.notEqual(startNotifications, endNotifications);
        chai.assert.equal(endNotifications, 0);
      });

      it('should correctly get all requested boards', (done) => {
        let boardsIds = boards.map((board) => board._id);
        let result1 = Boards.getBoards([boards[3]._id, boards[4]._id], users[2]._id); // Creativo
        let result2 = Boards.getBoards([boards[3]._id, boards[4]._id], users[3]._id); // Director
        chai.assert.deepEqual(result1.fetch(), [boards[3]]);

        let compare = (a, b) => {
          if (a._id < b._id) {
            return -1;
          }

          if (a._id > b._id) {
            return 1;
          }

          return 0;
        };

        let res = result2.fetch();
        let expected = [boards[4], boards[3]];
        res.sort(compare);
        expected.sort(compare);

        chai.assert.equal( // Bugss
          JSON.stringify(res),
          JSON.stringify(expected)
        );

        done();
      });
    });
  });
}

/* global Factory */
