import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';
import '../../factories/factories.js';
import { printObject } from '../../helpers/print-objects.js';

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

        request = {
          collection: 'todos',
          condition: {
            $eq: ['$$element.boardId', 'designBoardId']
          },
        };

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

      it('should publish the requested moduleInstance data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('moduleInstances.data', moduleInstances[0]._id, request, (collections) => {
          printObject({ migue: () => { return 5; }, michael: 'hola' });
          chai.assert.isTrue(collections.ModuleInstances.length == 1);
          chai.assert.isDefined(collections.ModuleInstances[0].todos.length == 1);
          done();
        });
      });
    });
  });
}
