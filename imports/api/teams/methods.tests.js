import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import   faker           from 'faker';
import { Random }        from 'meteor/random';

import { Teams }         from './teams.js';
import { createTeam,
         editTeam,
         shareTeam,
         removeUserFromTeam,
         archiveTeam,
         dearchiveTeam,
}                        from './methods.js';
import { createBoard }   from '../boards/methods.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Teams', function() {
    /*let user = {
      emails: [{ address: faker.internet.email() }],
    },
        name = faker.lorem.word(),
        usersEmails = [faker.internet.email(), faker.internet.email()],
        boardId = Random.id(),
        team = {
          _id: Random.id(),
          name,
          plan: 'free',
          type: 'web',
          boards: [
            { _id: boardId }
          ],
          users: [
            { email: user.emails[0].address, permission: 'owner' },
            { email: usersEmails[0], permission: 'member' },
            { email: usersEmails[1], permission: 'member' },
          ],
          archived: false,
        };*/
    let user, team;
    let usersEmails = [faker.internet.email(), faker.internet.email()],
        boardId = Random.id();

    beforeEach(function() {
      resetDatabase();

      user = Factory.create('user');
      team = Factory.create('team');

      team.users[0].email = user.emails[0].address;
      team.users.push({ email: usersEmails[0], permission: 'member' });
      team.users.push({ email: usersEmails[1], permission: 'member' });

      resetDatabase();

      sinon.stub(Meteor, 'user', () => user);

      Meteor.users.insert(user);
      Teams.insert(team);

      sinon.stub(createBoard, 'call', (obj, callback) => {
        let team = Teams.findOne(obj.teamId);

        team.boards.push({ _id: boardId });

        callback(null, { _id: boardId });
      });
    });

    afterEach(function() {
      createBoard.call.restore();
      Meteor.user.restore();
    });

    it('should create a team', function() {
      let args,
          result,
          expect;

      args = {
        name: team.name,
        plan: 'free',
        type: 'web',
        usersEmails,
      };
      expect = {
        name: team.name,
        plan: 'free',
        type: 'web',
        boards: [{ _id: boardId }],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
          { email: usersEmails[1], permission: 'member' },
        ],
        archived: false,
      };

      createTeam.call(args, (err, res) => {
        result = res;
        delete result._id;
      });
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
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
        boards: [],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
          { email: usersEmails[1], permission: 'member' },
        ],
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
        { email: user.emails[0].address, permission: 'owner' },
        { email: usersEmails[0], permission: 'member' },
      ];
      args = {
        email: usersEmails[1],
        teamId: team._id,
      };
      removeUserFromTeam.call(args, (err, res) => {
        result = res;
      });
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should archive a team', function(done) {
      let result,
          expect,
          args;

      args = {
        teamId: team._id,
      };
      expect = team;
      expect.archived = true;

      archiveTeam.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;

        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
    it('should dearchive a team', function(done) {
      let result,
          expect,
          args;

      args = {
        teamId: team._id,
      };
      expect = team;
      expect.archived = false;

      dearchiveTeam.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;

        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
  });
}
