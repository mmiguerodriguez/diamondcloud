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
          Factory.create('team', { url: faker.company.companyName().toLowerCase() }),
          Factory.create('team', { url: faker.company.companyName().toLowerCase(), archived: true }),
          Factory.create('team', { url: faker.company.companyName().toLowerCase() }),
        ];

        boards = [
          Factory.create('publicBoard', { name: 'General' }),
          Factory.create('publicBoard', { name: 'Publico archivado', archived: true }),
          Factory.create('privateBoard', { name: 'Privado con usuario' }),
          Factory.create('privateBoard', { name: 'Privado sin usuario' }),
        ];

        boards[2].users[0].email = user.emails[0].address;

        teams[0].users[0] = { email: user.emails[0].address, hierarchy: 'creativo' };
        teams[1].users[0] = { email: user.emails[0].address, hierarchy: 'creativo' };
        teams[2].users = [{ email: faker.internet.email(), hierarchy: 'sistemas' }];

        boards.forEach((board) => {
          teams[0].boards.push({ _id: board._id });
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

      it('should publish dashboard data', function(done) {//todo: remove exceptions in terminal
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('teams.dashboard', (collections) => {
          chai.assert.equal(collections.Teams.length, 1);
          chai.assert.equal(collections.users.length, 1);

          let _team = collections.Teams[0];
          chai.assert.isDefined(_team.name);
          chai.assert.isDefined(_team.plan);
          chai.assert.isDefined(_team.type);
          chai.assert.isDefined(_team.users);
          chai.assert.isDefined(_team.boards);
          chai.assert.isUndefined(_team.directChats);

          let _user = collections.users[0];
          chai.assert.isDefined(_user.emails);
          chai.assert.isDefined(_user.profile);
          done();
        });
      });
      it('should not publish team data if the team is archived', function(done){
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('teams.team', teams[1].url, (collections) => {
          chai.assert.isUndefined(collections.Teams);
          done();
        });
      });
      it('should not publish team data if the user is not in the team', function(done){
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('teams.team', teams[2].url, (collections) => {
          chai.assert.isUndefined(collections.Teams);
          done();
        });
      });
      it('should publish the correct boards, direct chats and users data', function(done){
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('teams.team', teams[0].url, (collections) => {
          chai.assert.equal(collections.Teams.length, 1);
          chai.assert.equal(collections.Teams[0].name, teams[0].name);
          chai.assert.equal(collections.Teams[0].plan, teams[0].plan);
          chai.assert.equal(collections.Teams[0].type, teams[0].type);
          chai.assert.deepEqual(collections.Teams[0].users, teams[0].users);

          chai.assert.equal(collections.Boards.length, 2);

          chai.assert.isDefined(collections.users);
          chai.assert.isDefined(collections.users[0].emails);
          chai.assert.isDefined(collections.users[0].profile);
          done();
        });
      });
    });
  });
}
