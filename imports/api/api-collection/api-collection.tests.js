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
      let input, output;

      beforeEach(function(done) {
        input = {
          _id: Random.id(),
          name: faker.lorem.word(),
          collection: faker.lorem.word(),
        };

        output = {
          'API__id': input._id,
          'API_name': input.name,
          'API_collection': input.collection,
        };

        done();
      });

      afterEach(function(done) {
        done();
      });

      it('should generate a correct Mongo query', function(done) {
        chai.assert.deepEqual(APICollection.generateMongoQuery(input), output);
        done();
      });
    });
  });
}
