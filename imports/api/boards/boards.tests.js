import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from '../teams/teams.js';
import { Boards }        from './boards.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    describe('Helpers', function() {
      let teams, boards, user;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');
        boards = [
          Factory.create('board'),
          Factory.create('board')
        ];
        teams = [
          Factory.create('team'),
          Factory.create('team'),
        ];

        teams[0].users.push({ email: user.emails[0].address, permission: 'owner' });
        teams[0].boards.push({ _id: boards[0]._id });
        teams[1].users.push({ email: user.emails[0].address, permission: 'owner' });

        boards[0].users.push({ _id: user._id });

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

      it('should return the team of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let team = board.team();

        chai.assert.isTrue(team._id === teams[0]._id);
      });
      it('should not return the team of a board', function() {
        let board = Boards.findOne(boards[1]._id);
        let team = board.team();

        chai.assert.isUndefined(team);
      });
    });
  });
}
