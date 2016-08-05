import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import '../../factories/factories.js';

if (Meteor.isServer) {
  describe('Modules API', function() {
    describe('Publication', function() {
      let user, teams, boards;

      beforeEach(function() {
        resetDatabase();
        user = Factory.create('user');
        teams = [
          Factory.create('team'),//with user
          Factory.create('team'),//without user
        ];
        board = Factory.create('publicBoard', { name: 'General' });
        board.users.push({ _id: user._id });

        teams[0].users[0].email = user.emails[0].address;

        teams[0].boards.push(board);
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
      it('should not publish team data if the team is archived', function(done){
        const collector = new PublicationCollector({ userId: user._id });
        let params = {
          collection: 'categories',
          condition: {},
          children: [
            {
              collection: 'todos',
              condition: {}
            }
          ]
        };
        collector.collect('teams.team', teams[1]._id, (collections) => {//pass the id of an archived team
          chai.assert.isUndefined(collections.Teams);//assert it does not return any team
          done();
        });
      });
    });
  });
}
