import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

if (Meteor.isClient) {
  describe('Users', function() {
    describe('Helpers', function() {
      let user = {
        _id: Random.id(),
        emails: [
          { address: faker.internet.email() }
        ],
        profile: {
          name: faker.name.findName(),
        }
      };

      beforeEach(function() {
        resetDatabase();
        Meteor.users.insert(user);
      });

      it('should not let users to update its values', function() {
        Meteor.users.update(user._id, {
          $set: {
            'profile.name': 'Another name',
          }
        });

        let result = Meteor.users.findOne(user._id);
        chai.assert.isTrue(result.profile.name === user.profile.name);
      });
    });
  });
}
