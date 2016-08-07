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
      let user, teams, boards, moduleInstance, request;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        teams = [
          Factory.create('team'), // With user
          Factory.create('team'), // Without user
        ];

        board = Factory.create('publicBoard', { name: 'General' });
        board.users.push({ _id: user._id });
        teams[0].users[0].email = user.emails[0].address;
        teams[0].boards.push(board);
        moduleInstance = Factory.create('todosModuleInstance');
        moduleInstance._id = Random.id();
        board.moduleInstances.push({ _id: moduleInstance._id });

        request = {
          collection: 'todos',
          condition: {
            $eq: ['$$todo.boardId', 'designBoardId']
          },
        };

        resetDatabase();

        Meteor.users.insert(user);
        Boards.insert(board);
        teams.forEach((team) => {
          Teams.insert(team);
        });
        ModuleInstances.insert(moduleInstance);
        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should publish the requested moduleInstance data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleInstances.data', moduleInstance._id, request, (collections) => {
          chai.assert.isDefined(collections.ModuleInstances[0]);
          chai.assert.isUndefined(collections.ModuleInstances[1]);
          chai.assert.isDefined(collections.ModuleInstances[0].data.todos[0]);
          chai.assert.isUndefined(collections.ModuleInstances[0].data.todos[1]);
          done();
        });
      });
    });
  });
}
