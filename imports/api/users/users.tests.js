import { Meteor }        from 'meteor/meteor';
import { Factory }       from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai, assert }  from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';

import { Hierarchies }   from '../hierarchies/hierarchies';
import { Teams }         from '../teams/teams';
import { Boards }        from '../boards/boards';

import                        './users';
import                        '../factories/factories';

if (Meteor.isServer) {
  describe('Users', function() {
    describe('Helpers', function(){
      let user, teams, boards, userHierarchy;
      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');

        teams = [
          Factory.create('team'),
          Factory.create('team', { archived: true }),
          Factory.create('team'),
        ];

        userHierarchy = Factory.create('hierarchy', {
          teamId: teams[0]._id,
        });

        boards = [
          Factory.create('publicBoard'),
          Factory.create('publicBoard', { archived: true }),
          Factory.create('privateBoard'), // with user
          Factory.create('privateBoard'), // without user
        ];

        teams[0].users[0] = {
          email: user.emails[0].address,
          hierarchy: userHierarchy._id,
        };
        teams[1].users[0] = {
          email: user.emails[0].address,
          hierarchy: Random.id(),
        };

        boards[2].users[0].email = user.emails[0].address;

        boards.forEach((board) => {
          teams[0].boards.push(board);
        });

        resetDatabase();
        Meteor.users.insert(user);
        teams.forEach((team) => {
          Teams.insert(team);
        });
        Hierarchies.insert(userHierarchy);
        boards.forEach((board) => {
          Boards.insert(board);
        });
        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should return the teams the user is in', function(done) {
        let result;
        result = user.teams({
          fields: {
            name: 1
          }
        });

        chai.assert.equal(result.count(), 1);

        result.forEach((team, index) => {
          chai.assert.isTrue(team.name === teams[index].name);
          chai.assert.isUndefined(team.users);
        });
        done();
      });

      it('should return the boards the user is able to see in a team', function() {
        let result;
        result = user.boards(teams[0]._id);

        chai.assert.equal(result.count(), 2);
      });

      it('should return user email', function() {
        let expect, result;

        expect = user.emails[0].address;
        result = user.email();

        chai.assert.equal(expect, result);
      });

      it('should find an user by email', function() {
        let expect, result;

        expect = Meteor.users.findOne(user._id);
        result = Meteor.users.findByEmail(user.emails[0].address, {});

        chai.assert.deepEqual(expect, result);
      });

      it('should return the correct user hierarchy', function() {
        const hierarchy = user.hierarchy(teams[0]._id);
        chai.assert.deepEqual(hierarchy, userHierarchy);
      });
    });
  });
}

if (Meteor.isClient) {
  describe('Users', () => {
    describe('Helpers', () => {
      it('should not let users to update its values', () => {
        const user = Factory.create('user');

        Meteor.users.update(user._id, {
          $set: {
            'profile.name': 'Another name',
          },
        });

        const result = Meteor.users.findOne(user._id);
        assert.equal(result.profile.name, user.profile.name);
      });
    });
  });
}
