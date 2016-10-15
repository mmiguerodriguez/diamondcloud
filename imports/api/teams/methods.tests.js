import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import   faker                  from 'faker';
import { Random }               from 'meteor/random';
import { Mail }                 from '../mails/mails.js';

import { Teams }                from './teams.js';
import { Boards }               from '../boards/boards.js';
import { createTeam,
         editTeam,
         changeUserHierarchy,
         shareTeam,
         removeUserFromTeam,
         archiveTeam,
         dearchiveTeam,
}                               from './methods.js';
import { createBoard }          from '../boards/methods.js';
import { createModuleInstance } from '../module-instances/methods.js';
import { APIInsert }            from '../api/methods.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Teams', function() {
    describe('Methods', function() {
      let users, team, board, generalBoardId = Random.id(),
          createModuleInstanceArgs,
          apiInsertArgs;

      beforeEach(function() {
        resetDatabase();

        createdGeneralBoard = false;
        users = [
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
        ];
        team = Factory.create('team');

        board = Factory.create('privateBoard');
        board.users = [
          { email: users[2].emails[0].address, notifications: 0 },
        ];

        team.users[0].email = users[0].emails[0].address;
        team.users.push({ email: users[1].emails[0].address, hierarchy: 'creativo' });
        team.users.push({ email: users[2].emails[0].address, hierarchy: 'creativo' });
        team.boards = [
          { _id: board._id },
        ];

        resetDatabase();

        sinon.stub(Meteor, 'user', () => users[0]);
        users.forEach((user) => {
          Meteor.users.insert(user);
        });
        Teams.insert(team);
        Boards.insert(board);

        sinon.stub(createBoard, 'call', (obj, callback) => {
          callback(null, { _id: generalBoardId });
        });
        sinon.stub(createModuleInstance, 'call', (obj, callback) => {
          createModuleInstanceArgs = obj;
          callback(null, { _id: 'moduleInstanceId' });
        });
        sinon.stub(APIInsert, 'call', (obj, callback) => {
          apiInsertArgs = obj;
          callback(null, null);
        });
        sinon.stub(Mail, 'sendMail', () => true);
      });

      afterEach(function() {
        createBoard.call.restore();
        Meteor.user.restore();
        Mail.sendMail.restore();
        createModuleInstance.call.restore();
        APIInsert.call.restore();
      });

      it('should create a team', function(done) {
        let args,
            result,
            expect;

        args = {
          name: team.name,
          plan: 'free',
          type: 'web',
          url: team.name.toLowerCase(),
          users: [
            {
              email: users[1].emails[0].address,
              hierarchy: 'creativo'
            },
            {
              email: users[2].emails[0].address,
              hierarchy: 'creativo'
            }
          ],
        };
        expect = {
          name: team.name,
          plan: 'free',
          type: 'web',
          url: team.name.toLowerCase(),
          boards: [
            { _id: generalBoardId },

          ],
          users: [
            { email: users[0].emails[0].address, hierarchy: 'sistemas' },
            { email: users[1].emails[0].address, hierarchy: 'creativo' },
            { email: users[2].emails[0].address, hierarchy: 'creativo' },
          ],
          archived: false,
        };

        createTeam.call(args, (err, res) => {
          result = res;
          delete result._id;

          chai.assert.deepEqual(result, expect);
          done();
        });
      });

      it('should edit a team', function() {
        let result,
            expect,
            args;

        expect = {
          _id: team._id,
          name: 'new_name',
          plan: 'premium',
          type: 'new_type',
          url: team.url,
          boards: team.boards,
          users: team.users,
          archived: false,
        };
        args = {
          team: {
            name: 'new_name',
            plan: 'premium',
            type: 'new_type',
          },
          teamId: team._id,
        };

        editTeam.call(args, (err, res) => {
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
      });

      it("should change a user's hierarchy", function(done){
        let expect = team;
        expect.users[1].hierarchy = 'director creativo';

        changeUserHierarchy.call({
          teamId: team._id,
          userEmail: team.users[1].email,
          hierarchy: 'director creativo',
        }, (error) => {
          let result = Teams.findOne(team._id);
          chai.assert.deepEqual(result, expect);
          done();
        });
      });

      it('should share a team', function(done) {
        let result,
            expect,
            args;

        expect = team;
        expect.users.push({ email: 'test@test.com', hierarchy: 'creativo' });
        args = {
          email: 'test@test.com',
          hierarchy: 'creativo',
          teamId: team._id,
        };

        shareTeam.call(args, (error, result) => {
          chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
          done();
        });
      });

      it('should remove a user from a team', function(done) {
        let result,
            expect,
            args;
        expect = team;
        expect.users = [
          { email: users[0].emails[0].address, hierarchy: 'sistemas' },
          { email: users[1].emails[0].address, hierarchy: 'creativo' },
        ];
        args = {
          email: users[2].emails[0].address,
          teamId: team._id,
        };
        removeUserFromTeam.call(args, (err, result) => {
          chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
          chai.assert.isTrue(Boards.findOne(board._id).users.length === 0);
          done();
        });
      });

      it('should archive a team', function() {
        let result,
            expect,
            args;

        args = {
          teamId: team._id,
        };
        expect = team;
        expect.archived = true;

        archiveTeam.call(args, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
      });

      it('should dearchive a team', function() {
        let result,
            expect,
            args;

        args = {
          teamId: team._id,
        };
        expect = team;
        expect.archived = false;

        dearchiveTeam.call(args, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
      });
    });
  });
}
