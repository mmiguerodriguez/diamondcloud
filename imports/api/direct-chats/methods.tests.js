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
    let userMails = [faker.internet.email(), faker.internet.email(), faker.internet.email()],
        user = {
          _id: Random.id(),
          emails: [{ address: userMails[0] }],
          name: faker.name.findName(),
        },
        otherUser = {
          _id: Random.id(),
          emails: [{ address: userMails[1] }],
          name: faker.name.findName(),
        },
        team = {
          _id: Random.id(),
          name: faker.lorem.word(),
          plan: 'free',
          type: 'web',
          users: [
            { email: userMails[0], permission: 'owner' },
            { email: userMails[1], permission: 'member' },
          ],
          archived: false,
        };

    beforeEach(function() {
      resetDatabase();
      sinon.stub(Meteor, 'user', () => user);
      sinon.stub(Meteor, 'userId', () => user._id);

      Meteor.users.insert(user);
      Meteor.users.insert(otherUser);

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
        userId: otherUser._id,
      };
      expect = {
        teamId: args.teamId,
        users: [
          { _id: user._id, notifications: 0 },
          { _id: otherUser._id, notifications: 0 },
        ],
      };

      createDirectChat.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err);
        result = res;

        expect._id = result._id;
      });

      createDirectChat.call(args, (err, res) => {
        if(err) {
          chai.assert.equal(err.details, 'chat_exists');
        }
      });

      chai.assert.deepEqual(result, expect);
      done();
    });
  });
}
