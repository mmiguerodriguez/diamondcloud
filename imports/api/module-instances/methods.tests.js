import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { ModuleInstances }         from './module-instances.js';
import { Teams }         from '../teams/teams.js';
import { Boards }         from '../boards/boards.js';
import {
  createModuleInstance,
  editModuleInstance,
  archiveModuleInstance,
  dearchiveModuleInstance,
  apiInsert,
  apiUpdate,
  apiGet,
  apiRemove,
}                        from './methods.js';

import '../factories/factories.js';

if(Meteor.isServer){
  describe('ModuleInstances', function(){

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

    it('should create a module instance', function() {
      let args, expect, result;
      args = {
        moduleId: module.moduleId,
        x: module.x,
        y: module.y,
        width: module.width,
        height: module.height,
        data: module.data,
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
        data: args.data,
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
        data: module.data,
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

    it('should dearchive a module instance', function() {
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

    it('should create a collection and an entry in module data', function() {
      let args, expect, result;
      args = {
        collection: 'todos',
        obj: {
          _id: 'id',
          prop1: 'val1',
        },
        visibleBy: [
          { userId: 'userId' },
        ],
        moduleInstanceId: module._id,
      };

      apiInsert.call(args);
      expect = {
        todos: [
          {
            _id: 'id',
            prop1: 'val1',
            visibleBy: [
              { userId: 'userId' },
            ]
          }
        ],
      };

      chai.assert.deepEqual(ModuleInstances.findOne(module._id).data, expect);
    });

    it('should update an entry in module data', function(done) {
      module.data = {
        todos: [
          {
            _id: 1,
            text: 'Todo 1',
            color: 'Red',
            visibleBy: [
              { userId: user._id },
            ]
          },
          {
            _id: 2,
            text: 'Todo 2',
            color: 'Green',
            visibleBy: [
              { boardId: board._id },
            ]
          },
          {
            _id: 3,
            text: 'Todo 3',
            color: 'Red'
          },
          {
            _id: 4,
            text: 'Todo 4',
            color: 'Red',
            visibleBy: [
              { userId: 'asd' },
            ],
          },
        ],
      };
      ModuleInstances.update(module._id, module, () => {
        apiUpdate.call({
          moduleInstanceId: module._id,
          collection: 'todos',
          filter: {
            color: {
              $in: ['Red', 'Green'],
            }
          },
          updateQuery: {
            $set: {
              color: 'Yellow',
            }
          }
        });
        let expect = module.data;
        expect.todos[0].color =  'Yellow'; // These are the modules that pass the filter
        expect.todos[1].color =  'Yellow';
        expect.todos[2].color =  'Yellow';

        chai.assert.deepEqual(ModuleInstances.findOne(module._id).data, expect);
        done();
      });
    });
    
    it('should get an entry from module data', function(done) {
      module.data = {
        todos: [
          {
            _id: 1,
            text: 'Todo 1',
            color: 'Red',
            visibleBy: [
              { userId: user._id },
            ]
          },
          {
            _id: 2,
            text: 'Todo 2',
            color: 'Green',
            visibleBy: [
              { boardId: board._id },
            ]
          },
          {
            _id: 3,
            text: 'Todo 3',
            color: 'Red'
          },
          {
            _id: 4,
            text: 'Todo 4',
            color: 'Red',
            visibleBy: [
              { userId: 'asd' },
            ],
          },
        ],
      };
      ModuleInstances.update(module._id, module, () => {
        apiGet.call({
          moduleInstanceId: module._id,
          collection: 'todos',
          filter: {
            color: {
              $in: ['Red', 'Green'],
            }
          },
        }, (err, res) => {
          let expect = [];
          expect.push(module.data.todos[0]);
          expect.push(module.data.todos[1]);
          expect.push(module.data.todos[2]);
          chai.assert.deepEqual(res, expect);
          done();
        });
      });
    });
    
    /*it('should remove an entry from module data', function(done) {
      module.data = {
        todos: [
          {
            _id: 1,
            text: 'Todo 1',
            color: 'Red',
            visibleBy: [
              { userId: user._id },
            ]
          },
          {
            _id: 2,
            text: 'Todo 2',
            color: 'Green',
            visibleBy: [
              { boardId: board._id },
            ]
          },
          {
            _id: 3,
            text: 'Todo 3',
            color: 'Red'
          },
          {
            _id: 4,
            text: 'Todo 4',
            color: 'Red',
            visibleBy: [
              { userId: 'asd' },
            ],
          },
        ],
      };
      ModuleInstances.update(module._id, module, () => {
        apiRemove.call({
          moduleInstanceId: module._id,
          collection: 'todos',
          filter: {
            color: {
              $in: ['Red', 'Green'],
            }
          },
        }, (err, res) => {
          let expect = [];
          expect.push(module.data.todos[0]);
          expect.push(module.data.todos[1]);
          expect.push(module.data.todos[2]);
          chai.assert.deepEqual(res, expect);
          done();
        });
      });
    });*/
  });
}
