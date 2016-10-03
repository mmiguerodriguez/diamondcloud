import { Meteor }           from 'meteor/meteor';
import { resetDatabase }    from 'meteor/xolvio:cleaner';
import { sinon }            from 'meteor/practicalmeteor:sinon';
import { chai }             from 'meteor/practicalmeteor:chai';
import { Random }           from 'meteor/random';
import   faker              from 'faker';

// import { DirectChats }      from './direct-chats.js';
import { createDirectChat } from './methods.js';
import { Teams }            from '../teams/teams.js';

if (Meteor.isServer) {
  describe('DirectChats', function() {
    let users, team;

    beforeEach(function() {
      resetDatabase();

      users = [
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
      ];
      team = Factory.create('team');

      team.users = [
        { email: users[0].emails[0].address, permission: 'owner' },
        { email: users[1].emails[0].address, permission: 'member' },
      ];

      resetDatabase();

      sinon.stub(Meteor, 'user', () => users[0]);
      sinon.stub(Meteor, 'userId', () => users[0]._id);

      users.forEach((user) => Meteor.users.insert(user));

      Teams.insert(team);
    });

    afterEach(function() {
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should create a direct chat', function(done) {
      let args,
          result,
          expect;

      args = {
        teamId: team._id,
        userId: users[1]._id,
      };
      expect = {
        teamId: args.teamId,
        users: [
          { _id: users[0]._id, notifications: 0 },
          { _id: users[1]._id, notifications: 0 },
        ],
      };

      createDirectChat.call(args, (err, res) => {
        if (err) throw new Meteor.Error(err);
        result = res;

        expect._id = result._id;
      });

      createDirectChat.call(args, (err, res) => {
        if (err) {
          chai.assert.equal(err.details, 'chat_exists');
        }
      });

      chai.assert.deepEqual(result, expect);
      done();
    });
  });
}
