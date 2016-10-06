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
      let user, moduleInstances, collections, documents;
      let insertRequest, globalInsertRequest, updateRequest, getRequest, removeRequest;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');

        moduleInstances = [
          Factory.create('moduleInstance'),
          Factory.create('moduleInstance'),
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

        insertRequest = {
          moduleInstanceId: moduleInstances[0]._id,
          collection: collections[0],
          object: documents[0],
          isGlobal: false,
        };

        resetDatabase();

        Meteor.users.insert(user);

        moduleInstances.forEach((moduleInstance) => {
          ModuleInstances.insert(moduleInstance);
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
        let insertedDoc = APICollection.findOne({ _id: documents[0]._id });
        insertedDoc = APICollection.clearAPIData(insertedDoc);
        printObject('input doc:', documents[0], 'output doc', insertedDoc);
        chai.assert.deepEqual(insertedDoc, documents[0]);
        done();
      });

      it('should update an API entry correctly', function(done) {
        done();
      });

      it('should get an entry from API Collection correctly', function(done) {
        done();
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
