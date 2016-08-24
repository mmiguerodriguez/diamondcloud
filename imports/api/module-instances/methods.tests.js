import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Boards }        from '../boards/boards.js';
import { ModuleInstances }         from './module-instances.js';
import {
  createModuleInstance,
  editModuleInstance,
  archiveModuleInstance,
  dearchiveModuleInstance,
}                        from './methods.js';

import '../factories/factories.js';

if(Meteor.isServer){
  describe('ModuleInstances', function(){

    let board, module, user;

    beforeEach(function() {
      resetDatabase();

      board = Factory.create('board');
      module = Factory.create('moduleInstance');
      user = Factory.create('user');

      module.boardId = board._id;

      resetDatabase();

      Boards.insert(board);
      ModuleInstances.insert(module);
      Meteor.users.insert(user);

      sinon.stub(Meteor, 'user', () => user);
    });

    afterEach(function() {
      Meteor.user.restore();
    });

    it('should create a module instance', function() {
      let expect, result;

      delete module._id;
      delete module.archived;

      createModuleInstance.call(module, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      expect = {
        _id: result._id,
        moduleId: module.moduleId,
        x: module.x,
        y: module.y,
        width: module.width,
        height: module.height,
        vars: module.vars,
        archived: false,
      };

      let _board = Boards.findOne(board._id);

      chai.assert.equal(JSON.stringify(expect), JSON.stringify(result));
      chai.assert.equal(_board.moduleInstances[0]._id, result._id);
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
        if(err) throw new Meteor.Error(err);
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
        vars: module.vars,
        archived: false,
      };

      chai.assert.equal(JSON.stringify(expect), JSON.stringify(result));
    });

    it('should archive a module instance', function() {
      let args, result;
      args = {
        moduleInstanceId: module._id,
      };

      archiveModuleInstance.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
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
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      chai.assert.isFalse(result.archived);
    });
  });
}
