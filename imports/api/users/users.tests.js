import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Users }         from './users.js';
import { Teams }         from '../teams/teams.js';
import { Boards }         from '../boards/boards.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Users', function() {
    describe('Helpers', function(){
      let user, teams, boards;
      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        
        teams = [
          Factory.create('team'),
          Factory.create('team', { archived: true }),
          Factory.create('team'),
        ];
        
        boards = [
          Factory.create('publicBoard'),
          Factory.create('publicBoard', { archived: true }),
          Factory.create('privateBoard'), // with user
          Factory.create('privateBoard'), // without user
        ];
        
        teams[0].users[0].email = user.emails[0].address;
        teams[1].users[0].email = user.emails[0].address;

        boards[2].users[0]._id = user._id;

        boards.forEach((board) => {
          teams[0].boards.push(board);
        });
        
        resetDatabase();
        Meteor.users.insert(user);
        teams.forEach((team) => {
          Teams.insert(team);
        });
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

      it('should return the boards the user is able to see in a team', function(done){
        let result;
        result = user.boards(teams[0]._id);
        chai.assert.equal(result.count(), 2);
        done();
      });
    });
  });
}
