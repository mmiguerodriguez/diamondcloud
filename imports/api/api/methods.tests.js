import { Meteor }                  from 'meteor/meteor';
import { resetDatabase }           from 'meteor/xolvio:cleaner';
import { sinon }                   from 'meteor/practicalmeteor:sinon';
import { chai }                    from 'meteor/practicalmeteor:chai';
import { Random }                  from 'meteor/random';
import   faker                     from 'faker';
import                                  '../factories/factories.js';

import { Boards }                  from '../boards/boards.js';
import { ModuleInstances }         from '../module-instances/module-instances.js';
import { ModuleData }              from '../module-data/module-data.js';
import { Teams }                   from '../teams/teams.js';
import {
  createModuleInstance,
  editModuleInstance,
  archiveModuleInstance,
  dearchiveModuleInstance,
  apiInsert,
  apiUpdate,
  apiGet,
  apiRemove,
}                                  from './methods.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Methods', function() {
      let moduleData, moduleInstance, user, board, team;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        team = Factory.create('team');
        board = Factory.create('publicBoard');
        moduleInstance = Factory.create('moduleInstance');
        moduleData = Factory.create('moduleData');
        moduleData.moduleId = moduleInstance.moduleId;
        moduleData._id = Random.id();
        moduleData.data = {
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
                { userId: Random.id() },
              ],
            },
          ],
        };
        team.boards.push({ _id: board._id });
        team.users[0].email = user.emails[0].address;
        board.moduleInstances.push({ _id: moduleInstance._id });
        moduleInstance.boardId = board._id;
        moduleData.teamId = team._id;

        resetDatabase();
        Teams.insert(team);
        Boards.insert(board);
        ModuleInstances.insert(moduleInstance);
        ModuleData.insert(moduleData);
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

      it('should create a collection and an entry in module data', function(done) {
        let args, expect, result;
        let temp = moduleData;
        temp.data = {};
        ModuleData.update(moduleData._id, temp);
        args = {
          collection: 'todos',
          obj: {
            _id: 'id',
            prop1: 'val1',
          },
          isGlobal: false,
          visibleBy: [
            { userId: 'userId' },
          ],
          moduleInstanceId: moduleInstance._id,
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

        console.log('Mandarina', ModuleData.findOne(moduleData._id).data, expect);
        chai.assert.deepEqual(ModuleData.findOne(moduleData._id).data, expect);
        moduleData.update(moduleData._id, moduleData);
        done();
      });

      it('should update an entry in module data', function(done) {
        ModuleData.update(moduleData._id, moduleData, () => {
          apiUpdate.call({
            moduleInstanceId: moduleInstance._id,
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
          let expect = moduleData.data;
          expect.todos[0].color =  'Yellow'; // These are the modules that pass the filter
          expect.todos[1].color =  'Yellow';
          expect.todos[2].color =  'Yellow';

          chai.assert.deepEqual(ModuleData.findOne(moduleData._id).data, expect);
          done();
        });
      });

      it('should get an entry from module data', function(done) {
        ModuleData.update(moduleData._id, moduleData, () => {
          apiGet.call({
            moduleInstanceId: moduleInstance._id,
            collection: 'todos',
            filter: {
              color: {
                $in: ['Red', 'Green'],
              }
            },
          }, (err, res) => {
            let expect = [];
            expect.push(moduleData.data.todos[0]);
            expect.push(moduleData.data.todos[1]);
            expect.push(moduleData.data.todos[2]);
            chai.assert.deepEqual(res, expect);
            done();
          });
        });
      });

      it('should remove an entry from module data', function(done) {
        ModuleData.update(moduleData._id, moduleData, () => {
          apiRemove.call({
            moduleInstanceId: moduleInstance._id,
            collection: 'todos',
            filter: {
              color: {
                $in: ['Red', 'Green'],
              }
            }
          }, (err, res) => {
            let expect = [moduleData.data.todos[3]];
            let result = ModuleData.findOne(moduleData._id).data.todos;
            chai.assert.deepEqual(result, expect);
            done();
          });
        });
      });
    });
  });
}
