import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from './teams.js';
import { Hierarchies }   from '../hierarchies/hierarchies';
import { BoardTypes }    from '../board-types/board-types';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Teams', function() {
    describe('Helpers', function() {
      let user, team, hierarchy, boardType;
      before(function() {
        resetDatabase();

        user = Factory.create('user');
        team = Factory.create('team');
        hierarchy = Factory.create('hierarchy');
        boardType = Factory.create('boardType');

        //team.boardTypeId
        team.users = [
          { email: user.emails[0].address, hierarchy: hierarchy._id },
          { email: faker.internet.email(), hierarchy: 'sistemas' },
          { email: faker.internet.email(), hierarchy: 'creativo' },
          { email: faker.internet.email(), hierarchy: 'creativo' },
          { email: faker.internet.email(), hierarchy: 'creativo' },
        ];

        resetDatabase();

        sinon.stub(Meteor, 'user', () => user);
        /*sinon.stub(Meteor.users, 'findByEmail', (emails, fields) => {
          return { emails, fields };
        });*/
        Meteor.users.insert(user);
        Teams.insert(team);
        Hierarchies.insert(hierarchy);
        BoardTypes.insert(boardType);
      });

      after(function() {
        Meteor.user.restore();
        //Meteor.users.findByEmail.restore();
      });

      it("should return a user's hierarchy", (done) => {
        let result = Teams.findOne(team._id).userHierarchy(user.emails[0].address);
        chai.assert.equal(hierarchy._id, result);
        done();
      });

      it('should return if the user has a given hierarchy', function() {
        let result = Teams.findOne(team._id).userIsCertainHierarchy(user.emails[0].address, hierarchy._id);
        chai.assert.isTrue(result);
        result = Teams.findOne(team._id).userIsCertainHierarchy(user.emails[0].address, 'sistemas');
        chai.assert.isFalse(result);
      });

      it('should return if a team has a user', function() {
        let result = Teams.findOne(team._id);
        chai.assert.isTrue(result.hasUser({ _id: user._id }));
        chai.assert.isTrue(result.hasUser({ email: team.users[1].email }));
        chai.assert.isFalse(result.hasUser({ email: faker.internet.email() }));
      });

      it('should return the users of a team', function() {
        let expect, result;

        expect = [{ _id: user._id, emails: user.emails }];
        result = Teams.findOne(team._id).getUsers({ emails: 1 }).fetch();

        chai.assert.deepEqual(JSON.stringify(result), JSON.stringify(expect));
      });

      it('should check if a user has certain permission', function(done) {
        let expected = true;

        let result = Teams.findOne(team._id).userHasCertainPermission(
          user.emails[0].address,
          hierarchy.permissions[1]
        );

        chai.assert.equal(result, expected);

        expected = false;

        result = Teams.findOne(team._id).userHasCertainPermission(
          user.emails[0].address,
          faker.lorem.word()
        );

        done();
      });

      it('should return the types of the team\'s boards', () => {

      });
    });
  });
}
