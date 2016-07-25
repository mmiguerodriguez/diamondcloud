import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Users }         from './users.js';
import { Teams }         from '../teams/teams.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Users', function() {
    describe('Helpers', function(){
      resetDatabase();
      let user = Factory.create('user'),
          teams = [
            Factory.create('team'),
            Factory.create('team', { archived: true }),
            Factory.create('team'),
          ];
      teams[0].users[0].email = user.emails[0].address;
      teams[1].users[0].email = user.emails[0].address;
      beforeEach(function() {
        resetDatabase();
        sinon.stub(Meteor, 'user', () => user);
        Meteor.users.insert(user);
        teams.forEach((team) => {
          Teams.insert(team);
        });
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
        chai.assert.isTrue(result.count() === 1);
        result.forEach((team, index) => {
          chai.assert.isTrue(team.name === teams[index].name);
          chai.assert.isUndefined(team.users);
        });
        
        done();
      });
    });
  });
}