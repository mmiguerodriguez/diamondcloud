import { Meteor }             from 'meteor/meteor';
import { resetDatabase }      from 'meteor/xolvio:cleaner';
import { sinon }              from 'meteor/practicalmeteor:sinon';
import { chai }               from 'meteor/practicalmeteor:chai';
import { Random }             from 'meteor/random';
import   faker                from 'faker';

import { Boards }             from '../boards/boards.js';
import { ModuleInstances }    from './module-instances.js';
import { Teams }              from '../teams/teams.js';
import {
  createModuleInstance,
  editModuleInstance,
  archiveModuleInstance,
  dearchiveModuleInstance,
}                             from './methods.js';

import                             '../factories/factories.js';

if (Meteor.isServer){
  describe('Module Instances', function() {
    describe('Methods', function() {
      let module, user, board, team;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        team = Factory.create('team');
        board = Factory.create('publicBoard');
        module = Factory.create('moduleInstance');
        module._id = Random.id();
        team.boards.push({ _id: board._id });
        team.users[0].email = user.emails[0].address;
        board.moduleInstances.push({ _id: module._id });
        module.boardId = board._id;

        resetDatabase();
        Teams.insert(team);
        Boards.insert(board);
        ModuleInstances.insert(module);
        Meteor.users.insert(user);

        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'userId', () => user._id);
        sinon.stub(Boards, 'isValid', () => true);
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
        Boards.isValid.restore();
      });

      it('should create a module instance', function(done) {
        let args, expect, result;
        args = {
          boardId: board._id,
          moduleId: module.moduleId,
          x: module.x,
          y: module.y,
          width: module.width,
          height: module.height
        };

        createModuleInstance.call(args, (err, result) => {
          if (err) throw new Meteor.Error(err);

          expect = {
            _id: result._id,
            moduleId: args.moduleId,
            x: args.x,
            y: args.y,
            width: args.width,
            height: args.height,
            archived: false,
            minimized: false,
          };

          let _board = Boards.findOne(board._id);

          chai.assert.equal(JSON.stringify(expect), JSON.stringify(result));
          // Changed to [1] since a moduleInstance is already inserted // board.moduleInstances.push({ _id: module._id });
          chai.assert.equal(_board.moduleInstances[1]._id, result._id);
          done();
        });
      });

      it('should edit a module instance', function() {
        let args, expect, result;
        args = {
          moduleInstanceId: module._id,
          x: 200,
          y: 300,
          width: 640,
          height: 480,
        };

        editModuleInstance.call(args, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result = res;
          delete result.boardId;
        });

        expect = {
          _id: result._id,
          moduleId: module.moduleId,
          x: args.x,
          y: args.y,
          width: args.width,
          height: args.height,
          archived: false,
          minimized: false
        };

        chai.assert.equal(JSON.stringify(expect), JSON.stringify(result));
      });

      it('should archive a module instance', function() {
        let args, result;
        args = {
          moduleInstanceId: module._id,
        };

        archiveModuleInstance.call(args, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result = res;
        });

        chai.assert.isTrue(result.archived);
      });

      it('should dearchive a module instance', function() {
        let args, result;
        args = {
          moduleInstanceId: module._id,
        };

        dearchiveModuleInstance.call(args, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result = res;
        });

        chai.assert.isFalse(result.archived);
      });
    });
  });
}
