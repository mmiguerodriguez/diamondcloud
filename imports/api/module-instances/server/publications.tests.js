import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';
import '../../factories/factories.js';

import { Boards }               from '../../boards/boards.js';
import { Teams }                from '../../teams/teams.js';
import { ModuleInstances }      from '../../module-instances/module-instances.js';

if (Meteor.isServer) {
  describe('Modules API', function() {
    describe('Publication', function() {
      let user, teams, board, moduleInstance, requests;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        teams = [
          Factory.create('team'), // With user
          Factory.create('team'), // Without user
        ];
        board = Factory.create('publicBoard', { name: 'General' });
        teams[0].users[0].email = user.emails[0].address;
        teams[0].users[0].permission = 'member';
        teams[0].boards.push({ _id: board._id });
        moduleInstances = [
          Factory.create('todosModuleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];
        board.moduleInstances.push({ _id: moduleInstances[0]._id });

        requests = [
          {
            collection: 'todos',
            condition: JSON.stringify({
              $eq: ['$$element.boardId', 'designBoardId']
            }),
          },
          {
            collection: 'categories',
            condition: JSON.stringify({
              $eq: ['$$element.color', 'red']
            }),
            children: [
              {
                collection: 'todos',
                condition: `{
                  $eq: ['$$element.categoryId', parents[0]._id]
                }`
              }
            ]
          }
        ];

        resetDatabase();

        Meteor.users.insert(user);
        Boards.insert(board);
        teams.forEach((team) => Teams.insert(team));
        moduleInstances.forEach((moduleInstance) => ModuleInstances.insert(moduleInstance));
        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should publish the requested moduleInstance data when there are no childrens', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleInstances.data', moduleInstances[0]._id, requests[0], (collections) => {
          chai.assert.isDefined(collections.ModuleInstances[0]);
          chai.assert.isUndefined(collections.ModuleInstances[1]);
          chai.assert.isDefined(collections.ModuleInstances[0].todos[0]);
          chai.assert.isUndefined(collections.ModuleInstances[0].todos[1]);
          done();
        });
      });

      it('should publish the requested moduleInstance data when there are childrens', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleInstances.data', moduleInstances[0]._id, requests[1], (collections) => {
          chai.assert.isDefined(collections.ModuleInstances[0]);
          chai.assert.isUndefined(collections.ModuleInstances[1]);
          chai.assert.isTrue(collections.ModuleInstances[0].categories.length == 2);
          chai.assert.isTrue(collections.ModuleInstances[0].todos.length == 6);
          done();
        });
      });
    });
  });
}
