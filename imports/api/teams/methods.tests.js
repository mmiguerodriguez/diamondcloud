import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import   faker                  from 'faker';
import { Random }               from 'meteor/random';
import { Mail }                 from '../mails/mails.js';
import { printObject }          from '../helpers/print-objects.js';

import { Teams }                from './teams.js';
import { Boards }               from '../boards/boards.js';
import { createTeam,
         editTeam,
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
      let users, team, board, generalBoardId = Random.id(), coordinationBoardId = Random.id(),
          createModuleInstanceArgs,
          apiInsertArgs,
          createdGeneralBoard = false;

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
        team.users.push({ email: users[1].emails[0].address, permission: 'member' });
        team.users.push({ email: users[2].emails[0].address, permission: 'member' });
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
          if (!createdGeneralBoard) {
            createdGeneralBoard = true;
            callback(null, { _id: generalBoardId });
          } else {
            callback(null, { _id: coordinationBoardId });
          }
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
          usersEmails: [
            users[1].emails[0].address,
            users[2].emails[0].address
          ],
        };
        expect = {
          name: team.name,
          plan: 'free',
          type: 'web',
          boards: [
            { _id: generalBoardId },
            { _id: coordinationBoardId },

          ],
          users: [
            { email: users[0].emails[0].address, permission: 'owner' },
            { email: users[1].emails[0].address, permission: 'member' },
            { email: users[2].emails[0].address, permission: 'member' },
          ],
          archived: false,
        };

        createTeam.call(args, (err, res) => {
          result = res;
          delete result._id;
          let expectedCreateModuleInstanceArgs = {
                boardId: coordinationBoardId,
                moduleId: 'task-manager',
                x: 100,
                y: 100,
                width: 500,
                height: 200,
              },
              expectedApiInsertArgs = {
                moduleInstanceId: 'moduleInstanceId',
                collection: 'coordinationBoard',
                object: {
                  _id: coordinationBoardId,
                },
                isGlobal: true,
              };

          chai.assert.deepEqual(result, expect);
          chai.assert.deepEqual(createModuleInstanceArgs, expectedCreateModuleInstanceArgs);
          chai.assert.deepEqual(apiInsertArgs, expectedApiInsertArgs);
          done();
        });
      });
      it('should edit a team', function() {
        let result,
            expect,
            args;

        expect = {
          _id: team._id,
          name: 'test',
          plan: 'premium',
          type: 'dota',
          boards: team.boards,
          users: team.users,
          archived: false,
        };
        args = {
          team: {
            name: 'test',
            plan: 'premium',
            type: 'dota',
          },
          teamId: team._id,
        };

        editTeam.call(args, (err, res) => {
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
      });
      it('should share a team', function() {
        let result,
            expect,
            args;

        expect = team;
        expect.users.push({ email: 'test@test.com', permission: 'member' });
        args = {
          email: 'test@test.com',
          teamId: team._id,
        };

        shareTeam.call(args, (err, res) => {
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
      });
      it('should remove a user from a team', function() {
        let result,
            expect,
            args;
        expect = team;
        expect.users = [
          { email: users[0].emails[0].address, permission: 'owner' },
          { email: users[1].emails[0].address, permission: 'member' },
        ];
        args = {
          email: users[2].emails[0].address,
          teamId: team._id,
        };
        removeUserFromTeam.call(args, (err, res) => {
          result = res;
        });
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        chai.assert.isTrue(Boards.findOne(board._id).users.length === 0);
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
