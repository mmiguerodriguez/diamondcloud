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
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard', { name: 'Publico archivado', archived: true }),
          Factory.create('privateBoard', { name: 'Privado con usuario' }),
          Factory.create('privateBoard', { name: 'Privado sin usuario' }),
        ];
        boards[2].users[0]._id = user._id;

        teams[0].users[0].email = user.emails[0].address;
        teams[1].users[0].email = user.emails[0].address;

        boards.forEach((board) => {
          teams[0].boards.push(board);
        });
        resetDatabase();
        Meteor.users.insert(user);
        boards.forEach((board) => {
          Boards.insert(board);
        });
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
            chai.assert.isDefined(team.boards);
            chai.assert.isUndefined(team.directChats);
          });
          done();
        });
      });
      it('should not publish team data if the team is archived', function(done){
        const collector = new PublicationCollector({ userId: user._id });
        
        collector.collect('teams.team', teams[1]._id, (collections) => {//pass the id of an archived team
          chai.assert.isUndefined(collections.Teams);//assert it does not return any team
          done();
        });
      });
      it('should not publish team data if the user is not in the team', function(done){
        const collector = new PublicationCollector({ userId: user._id });
        
        collector.collect('teams.team', teams[2]._id, (collections) => {//pass the id of a team the user is not in
          chai.assert.isUndefined(collections.Teams);//assert it does not return any team
          done();
        });
      });
      it('should publish the correct boards and direct chats data', function(done){
        const collector = new PublicationCollector({ userId: user._id });
        
        collector.collect('teams.team', teams[0]._id, (collections) => {
          chai.assert.equal(collections.Teams.length, 1);
          chai.assert.equal(collections.Teams[0].name, teams[0].name);
          chai.assert.equal(collections.Teams[0].plan, teams[0].plan);
          chai.assert.equal(collections.Teams[0].type, teams[0].type);
          chai.assert.deepEqual(collections.Teams[0].users, teams[0].users);

          chai.assert.equal(collections.Boards.length, 2);
          done();
        });
      });
    });
  });
}
