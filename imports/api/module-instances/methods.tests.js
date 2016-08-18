import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

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

    let module, user;

    beforeEach(function() {
      resetDatabase();

      module = Factory.create('moduleInstance');
      module._id = Random.id();

      user = Factory.create('user');

      resetDatabase();

      ModuleInstances.insert(module);
      Meteor.users.insert(user);

      sinon.stub(Meteor, 'user', () => user);
    });

    afterEach(function() {
      Meteor.user.restore();
    });

    it('should create a module instance', function() {
      let args, expect, result;
      args = {
        moduleId: module.moduleId,
        x: module.x,
        y: module.y,
        width: module.width,
        height: module.height,
        vars: module.vars,
      };

      createModuleInstance.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      expect = {
        _id: result._id,
        moduleId: args.moduleId,
        x: args.x,
        y: args.y,
        width: args.width,
        height: args.height,
        vars: args.vars,
        archived: false,
      };

      chai.assert.isTrue(JSON.stringify(expect) === JSON.stringify(result));
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

      chai.assert.isTrue(JSON.stringify(expect) === JSON.stringify(result));
    });

    it('should archive a module instance', function() {
      let args, expect, result;
      args = {
        moduleInstanceId: module._id,
      };

      archiveModuleInstance.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      expect = true;

      chai.assert.isTrue(expect === result.archived);
    });

    it('should archive a module instance', function() {
      let args, expect, result;
      args = {
        moduleInstanceId: module._id,
      };

      dearchiveModuleInstance.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      expect = false;

      chai.assert.isTrue(expect === result.archived);
    });

    it('should should create a collection and an entry in module data', function() {
      let args, expect, result;
      args = {
        collection: 'todos',
        obj: {
          prop1: 'val1',
        },
        visibleBy: [
          { userId: 'userId' },
        ],
        moduleInstanceId: module._id,
      };

      apiInsert.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;
      });

      expect = {
        todos: [
          {
            prop1: 'val1',
            visibleBy: [
              { userId: 'userId' },
            ]
          }
        ],
      };

      chai.assert.deepEqual(ModuleInstances.findOne(module._id).data, expect);
    });
  });
}
