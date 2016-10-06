import { Meteor }           from 'meteor/meteor';
import { resetDatabase }    from 'meteor/xolvio:cleaner';
import { printObject }      from '../helpers/print-objects.js';
import { sinon }            from 'meteor/practicalmeteor:sinon';
import { chai }             from 'meteor/practicalmeteor:chai';
import { Random }           from 'meteor/random';
import   faker              from 'faker';

import { APICollection }    from './api-collection.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Helpers', function() {
      let generateInput, generateOutput, cleanInput, cleanOutput;

      beforeEach(function(done) {
        generateInput = {
          _id: Random.id(),
          name: faker.lorem.word(),
          collection: faker.lorem.word(),
        };

        generateOutput = {
          'API__id': generateInput._id,
          'API_name': generateInput.name,
          'API_collection': generateInput.collection,
        };

        cleanInput = {
          _id: Random.id(),
          collection: faker.lorem.word(),
          moduleInstanceId: Random.id(),
          ['API__id']: Random.id(),
          ['API_name']: faker.lorem.word(),
          ['API_collection']: faker.lorem.word(),
        };

        /* jshint ignore:start */

        cleanOutput = {
          _id: cleanInput['API__id'],
          name: cleanInput['API_name'],
          collection: cleanInput['API_collection'],
        };

        /* jshint ignore:end */

        done();
      });

      afterEach(function(done) {
        done();
      });

      it('should generate a correct Mongo query', function(done) {
        let result = APICollection.generateMongoQuery(generateInput);
        chai.assert.deepEqual(result, generateOutput);
        done();
      });

      it('should clean the Mongo API Data', function(done) {
        let result = APICollection.cleanAPIData(cleanInput);
        chai.assert.deepEqual(result, cleanOutput);
        done();
      });
    });
  });
}
