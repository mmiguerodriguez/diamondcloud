import   faker                  from 'faker';
import { Meteor }               from 'meteor/meteor';
import { Random }               from 'meteor/random';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { printObject }          from '../../helpers/print-objects.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import                               '../../factories/factories.js';

import                               './publications.js';

import { Teams }                from '../../teams/teams.js';
import { Boards }               from '../../boards/boards.js';
import { ModuleInstances }      from '../../module-instances/module-instances.js';
import { APICollection }        from '../../api-collection/api-collection.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Subscriptions', function() {
      let user, teams, boards, modules, moduleInstances, documents, collections, filters;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');

        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];

        boards = [
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard', { name: faker.lorem.word() }),
          Factory.create('publicBoard', { name: faker.lorem.word() }),
        ];

        modules = [
          { _id: Random.id() },
          { _id: Random.id() },
        ];

        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];

        // Make documents
        documents = [];
        for (let i = 0; i < 5; i++) {
          documents.push(Factory.create('spamAPIDocument'));
        }

        // Convert documents into API documents
        documents.map((doc) => {
          let res = APICollection.generateMongoQuery(doc);
          res._id = doc._id;
          /* jshint ignore:start */
          delete res['API__id'];
          /* jshint ignore:end */
        });

        collections = [
          faker.lorem.word(),
          faker.lorem.word(),
        ];

        // Add user to teams
        teams[0].users[0].email = user.emails[0].address;
        teams[0].users[0].permission = 'member';
        teams[1].users[0].email = user.emails[0].address;
        teams[1].users[0].permission = 'member';

        // Assign boards to teams
        teams[0].boards.push({ _id: boards[0]._id });
        teams[0].boards.push({ _id: boards[1]._id });
        teams[1].boards.push({ _id: boards[2]._id });

        // Assign module instances to boards
        boards[0].moduleInstances.push({ _id: moduleInstances[0]._id });
        boards[0].moduleInstances.push({ _id: moduleInstances[1]._id });
        boards[1].moduleInstances.push({ _id: moduleInstances[2]._id });
        boards[2].moduleInstances.push({ _id: moduleInstances[3]._id });

        // Assign modules to module instances
        moduleInstances[0].moduleId = modules[0]._id;
        moduleInstances[1].moduleId = modules[1]._id;
        moduleInstances[2].moduleId = modules[0]._id;
        moduleInstances[3].moduleId = modules[1]._id;

        // Assign (module && team) || module instance to documents
        documents[0].moduleId = modules[0]._id;
        documents[0].teamId = teams[0]._id;
        documents[1].moduleId = modules[0]._id;
        documents[1].teamId = teams[0]._id;
        documents[2].moduleInstanceId = moduleInstances[1]._id;
        documents[3].moduleInstanceId = moduleInstances[0]._id;
        documents[4].moduleInstanceId = moduleInstances[3]._id;

        // Assign collections to documents
        documents[0].collection = collections[0];
        documents[1].collection = collections[0];
        documents[2].collection = collections[0];
        documents[3].collection = collections[1];
        documents[4].collection = collections[1];

        /* jshint ignore:start */

        // Assign another props
        documents[0]['API_something'] = faker.lorem.word();
        documents[1]['API_something'] = faker.lorem.word();


        filters = [
          {
            something: documents[0]['API_something']
          }
        ];

        /* jshint ignore:end */

        resetDatabase();

        Meteor.users.insert(user);

        teams.forEach((team) => {
          Teams.insert(team);
        });

        boards.forEach((board) => {
          Boards.insert(board);
        });

        moduleInstances.forEach((moduleInstance) => {
          ModuleInstances.insert(moduleInstance);
        });

        documents.forEach((doc) => {
          APICollection.insert(doc);
        });

        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should publish the requested data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('APICollection.data', moduleInstances[0]._id, collections[0], filters[0], (collections) => {
          chai.assert.deepEqual(collections.APICollection[0], documents[0]);
          done();
        });
      });

      it('should publish using persistent data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('APICollection.data', moduleInstances[0]._id, collections[1], {}, (collections) => {
          chai.assert.deepEqual(collections.APICollection[0], documents[3]);
          done();
        });
      });
    });
  });
}
