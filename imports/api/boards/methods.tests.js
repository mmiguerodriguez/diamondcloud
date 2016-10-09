import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from '../teams/teams.js';
import { Boards }        from './boards.js';
import { createBoard,
         archiveBoard,
         dearchiveBoard,
}                        from './methods.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    let users, board, team;

    beforeEach(function() {
      resetDatabase();

      users = [
        Factory.create('user'),
        {
          _id: Random.id(),
          emails: [{ address: faker.internet.email() }],
          profile: {
            name: faker.name.findName(),
          },
        },
        {
          _id: Random.id(),
          emails: [{ address: faker.internet.email() }],
          profile: {
            name: faker.name.findName(),
          },
        }
      ];
      team = Factory.create('team');
      board = Factory.create('publicBoard');

      team.users = [
        { email: users[0].emails[0].address, permission: 'owner' },
        { email: users[1].emails[0].address, permission: 'member' },
        { email: users[2].emails[0].address, permission: 'member' },
      ];
      board.users = [
        { email: users[0].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
        { email: users[1].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
        { email: users[2].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
      ];

      resetDatabase();

      sinon.stub(Meteor, 'user', () => users[0]);
      sinon.stub(Meteor, 'userId', () => users[0]._id);

      users.forEach((user) => Meteor.users.insert(user));

      Teams.insert(team);
      Boards.insert(board);
    });
    afterEach(function() {
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should create a board', function(done) {
      let test_1,
          test_2,
          result_1,
          result_2,
          expect_1,
          expect_2;

      test_1 = {
        teamId: team._id,
        name: faker.lorem.word(),
        type: faker.lorem.word(),
        users: [
          { email: users[0].emails[0].address },
        ],
        isPrivate: false,
      };
      test_2 = {
        teamId: team._id,
        name: faker.lorem.word(),
        type: faker.lorem.word(),
        isPrivate: true,
        users: [
          { email: users[0].emails[0].address },
          { email: users[1].emails[0].address },
          { email: users[2].emails[0].address },
        ],
      };
      expect_1 = {
        name: test_1.name,
        type: test_1.type,
        isPrivate: test_1.isPrivate,
        users: [
          { email: users[0].emails[0].address, notifications: 0 },
          { email: users[1].emails[0].address, notifications: 0 },
          { email: users[2].emails[0].address, notifications: 0 },
        ],
        moduleInstances: [],
        archived: false,
      };
      expect_2 = {
        name: test_2.name,
        type: test_2.type,
        isPrivate: test_2.isPrivate,
        users: [
          { email: users[0].emails[0].address, notifications: 0 },
          { email: users[1].emails[0].address, notifications: 0 },
          { email: users[2].emails[0].address, notifications: 0 },
        ],
        moduleInstances: [],
        archived: false,
      };

      createBoard.call(test_1, (err, res) => {
        if (err) throw new Meteor.Error(err);

        result_1 = res;
        delete result_1._id;

        createBoard.call(test_2, (err, res) => {
          if (err) throw new Meteor.Error(err);

          result_2 = res;
          delete result_2._id;

          chai.assert.deepEqual(result_1, expect_1);
          chai.assert.deepEqual(result_2, expect_2);
          done();
        });
      });
    });
    it('should archive a board', function(done) {
      let result,
          expect = board;

      archiveBoard.call({ _id: board._id }, (err, res) => {
        if (err) throw new Meteor.Error(err);

        result = res;
        expect.archived = true;

        chai.assert.equal(JSON.stringify(result), JSON.stringify(expect));
        done();
      });
    });
    it('should dearchive a board', function(done) {
      let result,
          expect = board;

      dearchiveBoard.call({ _id: board._id }, (err, res) => {
        if (err) throw new Meteor.Error(err);

        result = res;
        expect.archived = false;

        chai.assert.equal(JSON.stringify(result), JSON.stringify(expect));
        done();
      });
    });
  });
}
