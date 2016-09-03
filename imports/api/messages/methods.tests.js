import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';


import { Teams }         from '../teams/teams.js';
import { Boards }        from '../boards/boards.js';
import { DirectChats }   from '../direct-chats/direct-chats.js';
import { Messages }      from './messages.js';
import { sendMessage,
         seeMessage }    from './methods.js';

if (Meteor.isServer) {
  describe('Messages', function() {
    let usersIds = [Random.id(), Random.id(), Random.id()],
        emails = [faker.internet.email(), faker.internet.email(), faker.internet.email()],
        user = {
          _id: usersIds[0],
          emails: [{ address: emails[0] }],
        },
        board = {
          _id: Random.id(),
          name: faker.lorem.word(),
          isPrivate: false,
          users: [
            { _id: usersIds[0] },
            { _id: usersIds[1] },
            { _id: usersIds[2] }
          ],
          moduleInstances: [],
          drawings: [],
          archived: false,
        },
        team = {
          _id: Random.id(),
          name: faker.lorem.word(),
          plan: 'free',
          type: faker.lorem.word(),
          users: [
            { email: emails[0], permission: 'owner' },
            { email: emails[1], permission: 'member' },
            { email: emails[2], permission: 'member' },
          ],
          boards: [{ _id: board._id }],
          drawings: [],
          archived: false,
        },
        directChat = {
          _id: Random.id(),
          teamId: team._id,
          users: board.users,
        },
        messages = [
          Factory.create('message'),
          Factory.create('message')
        ];

        messages[0].directChatId = Random.id();
        messages[1].boardId = Random.id();

    beforeEach(function(done) {
      resetDatabase();
      sinon.stub(Meteor, 'user', () => user);

      Meteor.users.insert(user);
      Meteor.users.insert({
        _id: usersIds[1],
        emails: [{ address: emails[1] }],
      });
      Meteor.users.insert({
        _id: usersIds[2],
        emails: [{ address: emails[2] }],
      });

      Teams.insert(team);
      Boards.insert(board);
      DirectChats.insert(directChat);
      messages.forEach((message) => Messages.insert(message));
      done();
    });
    afterEach(function() {
      Meteor.user.restore();
    });

    it('should send a message', function(done) {
      let test_1,
          test_2,
          result_1,
          result_2,
          expect_1,
          expect_2;

      test_1 = {
        boardId: board._id,
        type: 'text',
        content: faker.lorem.sentence(),
        createdAt: (new Date()).getTime(),
      };
      expect_1 = {
        senderId: user._id,
        type: 'text',
        content: test_1.content,
        createdAt: test_1.createdAt,
        seers: [],
        boardId: board._id,
      };

      test_2 = {
        directChatId: directChat._id,
        type: 'text',
        content: faker.lorem.sentence(),
        createdAt: (new Date()).getTime(),
      };
      expect_2 = {
        senderId: user._id,
        type: 'text',
        content: test_2.content,
        createdAt: test_2.createdAt,
        seen: false,
        directChatId: directChat._id,
      };

      sendMessage.call(test_1, (err, res) => {
        if (err) throw new Meteor.Error(err);
        result_1 = res;
        sendMessage.call(test_2, (err, res) => {
          if (err) throw new Meteor.Error(err);
          result_2 = res;

          chai.assert.deepEqual(expect_1, result_1);
          chai.assert.deepEqual(expect_2, result_2);
          done();
        });
      });
    });

    it('should see a message in a directChat', function(done) {
      let expected = messages[0];
      expected.seen = true;

      seeMessage.call({ messageId: messages[0]._id }, (err, res) => {
        chai.assert.isTrue(JSON.stringify(res) === JSON.stringify(expected));
        done();
      });
    });

    it('should see a message in a board', function(done) {
      let expected = messages[1];
      expected.seers.push(user._id);

      seeMessage.call({ messageId: messages[1]._id }, (err, res) => {
        chai.assert.isTrue(JSON.stringify(res) === JSON.stringify(expected));
        done();
      });
    });
  });
}
