import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }           from '../teams/teams.js';
import { ModuleInstances } from '../module-instances/module-instances.js';
import { Boards }          from './boards.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    describe('Helpers', function() {
      let teams, boards, user, moduleInstances;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');
        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];
        boards = [
          Factory.create('board'),
          Factory.create('board'),
          Factory.create('board'),
        ];
        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];

        teams[0].users.push({ email: user.emails[0].address, permission: 'owner' });
        teams[0].boards.push({ _id: boards[0]._id });
        teams[1].users.push({ email: user.emails[0].address, permission: 'owner' });

        boards[0].users.push({ _id: user._id });
        boards[2].moduleInstances.push({ _id: moduleInstances[0]._id });

        resetDatabase();

        Meteor.users.insert(user);

        boards.forEach((board) => {
          Boards.insert(board);
        });

        teams.forEach((team) => {
          Teams.insert(team);
        });

        moduleInstances.forEach((moduleInstance) => {
          ModuleInstances.insert(moduleInstance);
        });

        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'userId', () => user._id);
      });
      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
      });

      it('should return the team of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let team = board.team();

        chai.assert.isTrue(team._id === teams[0]._id);
      });
      it('should not return the team of a board', function() {
        let board = Boards.findOne(boards[1]._id);
        let team = board.team();

        chai.assert.isUndefined(team);
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
      it('should remove a user from a board', function() {
        let expect = boards[0];
        expect.users = [];
        Boards.removeUser(boards[0]._id, user._id);
        chai.assert.deepEqual( Boards.findOne(boards[0]._id), expect);
      });
      it('should add a user to a board', function() {
        let expect = boards[0],
            _id = Random.id();
        expect.users.push({ _id });
        Boards.addUser(boards[0]._id, _id);
        chai.assert.deepEqual( Boards.findOne(boards[0]._id), expect);
      });
    });
  });
}
