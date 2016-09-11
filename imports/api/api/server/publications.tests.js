import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';

import { printObject }          from '../../helpers/print-objects.js';
import                               './publications.js';
import                               '../../factories/factories.js';

import { Boards }               from '../../boards/boards.js';
import { Teams }                from '../../teams/teams.js';
import { ModuleInstances }      from '../../module-instances/module-instances.js';
import { ModuleData }           from '../../module-data/module-data.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Subscriptions', function() {
      let user, teams, board, moduleInstances, moduleData, requests;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];
        board = Factory.create('publicBoard', { name: 'General' });
        teams[0].users[0].email = user.emails[0].address;
        teams[0].users[0].permission = 'member';
        teams[0].boards.push({ _id: board._id });
        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];
        board.moduleInstances.push({ _id: moduleInstances[0]._id });
        board.moduleInstances.push({ _id: moduleInstances[1]._id });
        moduleData = Factory.create('moduleData');
        moduleData.teamId = teams[0]._id;
        moduleData.moduleId = moduleInstances[0].moduleId;
        moduleInstances[1].moduleId = moduleData.moduleId;

        request = {
          collection: 'todos',
          condition: {
            $eq: ['$$element.color', 'Red']
          },
        };

        otherRequest = {
          collection: 'todos'
        };

        moduleData.data = {
          todos: [
            {
              _id: 1,
              text: 'Todo 1',
              color: 'Red',
              isGlobal: true,
              visibleBy: [
                { userId: user._id },
              ]
            },
            {
              _id: 2,
              text: 'Todo 2',
              color: 'Red',
              isGlobal: false,
              moduleInstanceId: moduleInstances[0]._id,
              visibleBy: [
                { boardId: board._id },
              ],
            },
            {
              _id: 3,
              text: 'Todo 3',
              color: 'Green',
              isGlobal: true,
            },
            {
              _id: 4,
              text: 'Todo 4',
              color: 'Red',
              isGlobal: false,
              moduleInstanceId: moduleInstances[0]._id,
              visibleBy: [
                { userId: Random.id() },
              ],
            },
          ],
        };

        resetDatabase();

        Meteor.users.insert(user);
        Boards.insert(board);
        teams.forEach((team) => Teams.insert(team));
        moduleInstances.forEach((moduleInstance) => ModuleInstances.insert(moduleInstance));
        ModuleData.insert(moduleData);
        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should publish the requested data', function(done) {
        let expect = [
          moduleData.data.todos[0],
          moduleData.data.todos[1],
        ];

        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleData.data', moduleInstances[0]._id, request, (collections) => {
          printObject('Zaratustra', collections.ModuleData);
          chai.assert.equal(collections.ModuleData.length, 1);
          chai.assert.deepEqual(collections.ModuleData[0].data.todos, expect);
          done();
        });
      });

      it('should publish using persistent data', function(done) {
        let expect = [
          moduleData.data.todos[0],
          moduleData.data.todos[2]
        ];

        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleData.data', moduleInstances[1]._id, otherRequest, (collections) => {
          printObject('Kiwasawa', collections.ModuleData);
          chai.assert.equal(collections.ModuleData.length, 1);
          chai.assert.deepEqual(collections.ModuleData[0].data.todos, expect);
          done();
        });
      });
    });
  });
}
