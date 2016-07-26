import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import { Teams }                from '../teams.js';
import { DirectChats }          from '../../direct-chats/direct-chats.js';
import { Boards }               from '../../boards/boards.js';

import '../../factories/factories.js';

if (Meteor.isServer) {
  
  describe('Teams', function() {
    describe('Publications', function() {
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
        Meteor.users.insert(user);
        teams.forEach((team) => {
          Teams.insert(team);
        });
        sinon.stub(Meteor, 'user', () => user);
      });
      
      afterEach(function() {
        Meteor.user.restore();
      });
      
      it('should publish dashboard data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        
        collector.collect('teams.dashboard', (collections) => {
          chai.assert.equal(collections.Teams.length, 1);
          
          collections.Teams.forEach((team, index) => {
            /*
            chai.assert.isTrue(team.name === teams[index].name);
            chai.assert.isTrue(team.plan === teams[index].plan);
            chai.assert.isTrue(team.type === teams[index].type);
            chai.assert.isTrue(JSON.stringify(team.users) === JSON.stringify(teams[index].users));
            */
            chai.assert.isDefined(team.name);
            chai.assert.isDefined(team.plan);
            chai.assert.isDefined(team.type);
            chai.assert.isDefined(team.users);
            chai.assert.isUndefined(team.boards);
            chai.assert.isUndefined(team.directChats);
          });
          done();
        });
      });
    });
  });
}