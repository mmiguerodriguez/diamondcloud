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
    let users, team, boards;

    beforeEach(function() {
      resetDatabase();

      users = [
        Factory.create('user'),
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
      ];
      team = Factory.create('team', { 
        users: [
          { email: users[0].emails[0].address, permission: 'owner' },
          { email: users[1].emails[0].address, permission: 'member' },
          { email: users[2].emails[0].address, permission: 'member' },
        ],
      });
      boards = [
        Factory.create('publicBoard', { 
          users: [
            { email: users[0].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
            { email: users[1].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
            { email: users[2].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
          ]
        }),
        Factory.create('publicBoard', { 
          users: [
            { email: users[0].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
          ],
          type: 'Creativos'
        }),
        Factory.create('privateBoard', { 
          users: [
            { email: users[0].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
            { email: users[1].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
            { email: users[2].emails[0].address, notifications: faker.random.number({ min: 0, max: 20 }) },
          ],
          type: 'Creativos'
        }),
      ];

      resetDatabase();

      sinon.stub(Meteor, 'user', () => users[0]);
      sinon.stub(Meteor, 'userId', () => users[0]._id);

      users.forEach((user) => Meteor.users.insert(user));
      Teams.insert(team);
      boards.forEach((board) => {
        Boards.insert(board);
      });
    });
    afterEach(function() {
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should create a board', function(done) {
      let test_1,
          test_2;

      test_1 = {
        teamId: team._id,
        name: boards[1].name,
        type: boards[1].type,
        users: [
          { email: users[0].emails[0].address },
        ],
        isPrivate: false,
      };
      test_2 = {
        teamId: team._id,
        name: boards[2].name,
        type: boards[2].type,
        isPrivate: true,
        users: [
          { email: users[0].emails[0].address },
          { email: users[1].emails[0].address },
          { email: users[2].emails[0].address },
        ],
      };
      
      createBoard.call(test_1, (err, result_1) => {
        if (err) throw new Meteor.Error(err);
        
        boards[1]._id = result_1._id;
        boards[1].users = result_1.users;

        createBoard.call(test_2, (err, result_2) => {
          if (err) throw new Meteor.Error(err);

          boards[2]._id = result_2._id;
          boards[2].users = result_2.users;

          chai.assert.equal(JSON.stringify(result_1), JSON.stringify(boards[1]));
          chai.assert.equal(JSON.stringify(result_2), JSON.stringify(boards[2]));
          
          done();
        });
      });
    });

    it('should archive a board', function(done) {
      let result,
          expect = boards[0];

      archiveBoard.call({ _id: boards[0]._id }, (err, res) => {
        if (err) throw new Meteor.Error(err);

        result = res;
        
        expect._id = res._id;
        expect.archived = true;

        chai.assert.equal(JSON.stringify(result), JSON.stringify(expect));
        done();
      });
    });

    it('should dearchive a board', function(done) {
      let result,
          expect = boards[0];

      dearchiveBoard.call({ _id: boards[0]._id }, (err, res) => {
        if (err) throw new Meteor.Error(err);

        result = res;
        expect._id = res._id;
        expect.archived = false;

        chai.assert.equal(JSON.stringify(result), JSON.stringify(expect));
        done();
      });
    });
  });
}
