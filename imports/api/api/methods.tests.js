import { Meteor }                  from 'meteor/meteor';
import { resetDatabase }           from 'meteor/xolvio:cleaner';
import { sinon }                   from 'meteor/practicalmeteor:sinon';
import { chai }                    from 'meteor/practicalmeteor:chai';
import { Random }                  from 'meteor/random';
import { printObject }             from '../helpers/print-objects.js';
import   faker                     from 'faker';
import                                  '../factories/factories.js';

import { Boards }                  from '../boards/boards.js';
import { ModuleInstances }         from '../module-instances/module-instances.js';
import { APICollection }           from '../api-collection/api-collection.js';
import { Teams }                   from '../teams/teams.js';
import {
  APIInsert,
  APIUpdate,
  APIGet,
  APIRemove,
}                                  from './methods.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Methods', function() {
      let user,
          moduleInstances,
          boards,
          teams,
          collections,
          documents;

      let insertRequest,
          globalInsertRequest,
          updateRequest,
          getRequest,
          removeRequest;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');

        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
        ];

        boards = [
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard'),
        ];

        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];

        collections = [
          faker.lorem.word(),
          faker.lorem.word(),
          faker.lorem.word(),
        ];

        // Make documents
        documents = [];
        for (let i = 0; i < 8; i++) {
          documents.push(Factory.create('spamAPIDocument'));
        }
        documents[0].something = faker.lorem.word();

        insertRequest = {
          moduleInstanceId: moduleInstances[0]._id,
          collection: collections[0],
          object: documents[0],
          isGlobal: false,
        };

        updateRequest = {
          moduleInstanceId: moduleInstances[0]._id,
          collection: collections[0],
          filter: {
            something: documents[0].something,
          },
          updateQuery: {
            $set: {
              somethingElse: faker.lorem.word(),
            }
          },
        };

        getRequest = {
          moduleInstanceId: moduleInstances[0]._id,
          collection: collections[0],
          filter: {
            something: documents[0].something,
          },
        };

        // Assign module instances to boards
        boards[0].moduleInstances.push({ _id: moduleInstances[0]._id });
        boards[0].moduleInstances.push({ _id: moduleInstances[1]._id });

        // Assign boards to module instances
        teams[0].boards.push({ _id: boards[0]._id });
        teams[0].boards.push({ _id: boards[1]._id });

        resetDatabase();

        Meteor.users.insert(user);

        moduleInstances.forEach((moduleInstance) => {
          ModuleInstances.insert(moduleInstance);
        });

        boards.forEach((board) => {
          Boards.insert(board);
        });

        teams.forEach((team) => {
          Teams.insert(team);
        });

        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'userId', () => user._id);
        sinon.stub(Boards, 'isValid', () => true);
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
        Boards.isValid.restore();
      });

      it('should insert correctly the API data', function(done) {
        APIInsert.call(insertRequest);
        let res = APICollection.findOne({ _id: documents[0]._id });
        let expected = documents[0];
        expected['#collection'] = collections[0];
        expected['#moduleInstanceId'] = moduleInstances[0]._id;
        chai.assert.deepEqual(res, expected);
        APICollection.remove({});
        done();
      });

      it('should update an API entry correctly', function(done) {
        let doc = documents[0];
        doc['#collection'] = collections[0];
        doc['#moduleInstanceId'] = moduleInstances[0]._id;
        APICollection.insert(doc);
        doc.somethingElse = updateRequest.updateQuery.$set.somethingElse;
        APIUpdate.call(updateRequest);
        let updatedDoc = APICollection.findOne({ _id: documents[0]._id });
        chai.assert.deepEqual(updatedDoc, doc);
        APICollection.remove({});
        done();
      });

      it('should get an entry from API Collection correctly', function(done) {
        let doc = documents[0];
        doc['#collection'] = collections[0];
        doc['#moduleInstanceId'] = moduleInstances[0]._id;
        APICollection.insert(doc);
        APIGet.call(getRequest, (err, res) => {
          chai.assert.deepEqual(res[0], doc);
          APICollection.remove({});
          done();
        });
      });

      it('should remove an entry from API Collection correctly', function(done) {
        done();
      });

      /*
      it('should update using persistent data when indicated', function(done) {
        done();
      });

      it('should get using persistent data when indicated', function(done) {
        done();
      });

      it('should remove using persistent data when indicated', function(done) {
        done();
      });
      */
    });
  });
}
