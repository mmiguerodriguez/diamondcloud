import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from './teams.js';

if (Meteor.isServer) {
  describe('Teams', function() {
    describe('Helpers', function(){
      let user = {
            _id: Random.id(),
            emails: [{ address: faker.internet.email() }],
          },
          team = {
            _id: Random.id(),
            name: faker.lorem.word(),
            users: [
              { email: user.emails[0].address, permission: 'member' },
              { email: faker.internet.email(), permission: 'owner' },
              { email: faker.internet.email(), permission: 'member' },
              { email: faker.internet.email(), permission: 'member' },
              { email: faker.internet.email(), permission: 'member' },
            ],
            archived: false,
          };
      
      beforeEach(function() {
        resetDatabase();
        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor.users, 'findByEmail', (emails, fields) => {emails, fields});
        Meteor.users.insert(user);
        Teams.insert(team);
      });
      
      afterEach(function() {
        Meteor.user.restore();
        Meteor.users.findByEmail.restore()
      });
      
      it('should return owner of a team', function() {
        let expected = team.users[1].email;
        let result = Teams.findOne(team._id).owner();
        
        chai.assert.isTrue(result == expected);
      });
      
      it('should return if a team has a user', function() {
        let result = Teams.findOne(team._id);
        
        chai.assert.isTrue(result.hasUser({ _id: user._id }));
        chai.assert.isTrue(result.hasUser({ email: team.users[1].email }));
        chai.assert.isFalse(result.hasUser({ email: faker.internet.email() }));
      });
      
      it('should return the users of a team', function() {
        let result = Teams.findOne(team._id).getUsers({ field1: 'value1' }),
            expect = {
              emails: team.users,
              fields: { field1: 'value1' }
            };
        expect.emails.forEach((email, index) => {
          expect.emails[index] = email.email;
        });
        
        
        chai.assert.deepEqual(result, expect);
      });
    });
  });
}