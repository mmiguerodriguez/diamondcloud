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
      /*let user = {
            _id: Random.id(),
            emails: [
              { address: faker.internet.email() }
            ],
          },
          teams = [{
            _id: '1',
            name: 'Team 1',
            users: [
              { email: user.emails[0].address, permission: 'owner' },
            ],
            archived: false,
          }, {
            _id: '2',
            name: 'Team 2',
            users: [
              { email: user.emails[0].address, permission: 'owner' },
            ],
            archived: true,
          }, {
            _id: '3',
            name: 'Team 3',
            users: [
              { email: 'randommail@gmail.com', permission: 'owner' },
            ],
          }];*/
      let user = Factory.create('user');
      let teams = [
        Factory.create('team'),
        Factory.create('team', { archived: true }),
        Factory.create('team'),
      ];
      
      teams[0].users[0].email = user.emails[0].address;
      teams[1].users[0].email = user.emails[0].address;
          
      beforeEach(function() {
        resetDatabase();
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
        console.log(`TEAMS: ${JSON.stringify(teams, null, 2)}`);
        console.log(`USER: ${JSON.stringify(user, null, 2)}`);
        console.log(`RESULT: ${result.count()}`);
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