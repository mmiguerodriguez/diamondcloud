import { Meteor }          from 'meteor/meteor';
import { resetDatabase }   from 'meteor/xolvio:cleaner';
import { sinon }           from 'meteor/practicalmeteor:sinon';
import { chai }            from 'meteor/practicalmeteor:chai';

import { insertFirstUser } from './methods';
import { Teams }           from '../teams/teams';
import { Boards }          from '../boards/boards';

import '../factories/factories';

if (Meteor.isServer) {
  describe('Accounts', () => {
    describe('Methods', () => {
      let user;
      let board;
      let team;

      beforeEach(() => {
        resetDatabase();

        user = Factory.create('user');
        board = Factory.create('publicBoard');
        team = Factory.create('team', { boards: [{ _id: board._id }], users: [] });

        resetDatabase();

        Meteor.users.insert(user);
        Boards.insert(board);
        Teams.insert(team);

        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(() => {
        Meteor.user.restore();
      });

      it('should insert the first user of a team on login', (done) => {
        insertFirstUser.call({ url: team.url }, (error, result) => {
          if (error) {
            throw new Meteor.Error(error);
          } else {
            const _team = Teams.findOne({ _id: team._id });
            const _board = Boards.findOne({ _id: _team.boards[0]._id });

            chai.assert.equal(_team.users.length, 1);
            chai.assert.equal(_board.users[0].email, user.emails[0].address);
            chai.assert.deepEqual(_team.users, [{ email: user.emails[0].address, hierarchy: 'sistemas' }]);

            done();
          }
        });
      });
    });
  });
}
