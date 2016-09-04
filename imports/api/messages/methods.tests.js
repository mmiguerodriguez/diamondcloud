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

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Messages', function() {
    let users, team, board, directChat, messages;

    beforeEach(function(done) {
      resetDatabase();

      users = [
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
        Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
      ];
      team = Factory.create('team');
      board = Factory.create('publicBoard');
      directChat = Factory.create('directChat');
      messages = [
        Factory.create('directChatMessage'),
        Factory.create('boardMessage'),
      ];

      team.boards.push({ _id: board._id });
      team.users = [
        { email: users[0].emails[0].address, permission: 'owner' },
        { email: users[1].emails[0].address, permission: 'member' },
      ];
      board.users = [
        { _id: users[0]._id, notifications: faker.random.number({ min: 0, max: 100 }) },
        { _id: users[1]._id, notifications: faker.random.number({ min: 0, max: 100 }) },
      ];
      directChat.teamId = team._id;
      directChat.users = board.users;
      messages[0].directChatId = directChat._id;
      messages[1].boardId = board._id;

      resetDatabase();

      sinon.stub(Meteor, 'user', () => users[0]);

      users.forEach((user) => Meteor.users.insert(user));

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
        senderId: users[0]._id,
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
        senderId: users[0]._id,
        type: 'text',
        content: test_2.content,
        createdAt: test_2.createdAt,
        seen: false,
        directChatId: directChat._id,
      };

      sendMessage.call(test_1, (err, result) => {
        if (err) throw new Meteor.Error(err);
        result_1 = result;
        sendMessage.call(test_2, (err, result) => {
          if (err) throw new Meteor.Error(err);
          result_2 = result;

          chai.assert.deepEqual(expect_1, result_1);
          chai.assert.deepEqual(expect_2, result_2);
          done();
        });
      });
    });

    it('should see a message in a directChat', function(done) {
      let expected = messages[0];
      expected.seen = true;

      seeMessage.call({ messageId: messages[0]._id }, (err, result) => {
        if(err) console.log(err);
        chai.assert.deepEqual(result, expected);
        done();
      });
    });

    it('should see a message in a board', function(done) {
      let expected = messages[1];
      expected.seers.push(users[0]._id);

      seeMessage.call({ messageId: messages[1]._id }, (err, result) => {
        chai.assert.deepEqual(result, expected);
        done();
      });
    });
  });
}
