import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from '../teams/teams';
import { Boards }        from '../boards/boards';
import { DirectChats }   from '../direct-chats/direct-chats';
import { Messages }      from './messages';
import {
  sendMessage,
  seeMessage
}                        from './methods';

import '../factories/factories';

if (Meteor.isServer) {
  describe('Messages', () => {
    let users;
    let team;
    let board;
    let directChat;
    let messages;
    let title;
    let text;
    let query;
    let test1;
    let test2;
    let expect1;
    let expect2;

    beforeEach((done) => {
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
        { email: users[0].emails[0].address, hierarchy: 'sistemas' },
        { email: users[1].emails[0].address, hierarchy: 'creativo' },
      ];
      board.users = [
        { email: users[0].emails[0].address, notifications: faker.random.number({ min: 1, max: 20 }) },
        { email: users[1].emails[0].address, notifications: faker.random.number({ min: 1, max: 20 }) },
      ];
      directChat.teamId = team._id;
      directChat.users = [
        { _id: users[0]._id, notifications: board.users[0].notifications },
        { _id: users[1]._id, notifications: board.users[1].notifications }
      ];
      messages[0].directChatId = directChat._id;
      messages[1].boardId = board._id;
      messages[1].senderId = users[1]._id;

      test1 = {
        boardId: board._id,
        type: 'text',
        content: faker.lorem.sentence(),
      };
      test2 = {
        directChatId: directChat._id,
        type: 'text',
        content: faker.lorem.sentence(),
      };
      expect1 = {
        senderId: users[0]._id,
        type: 'text',
        content: test1.content,
        boardId: board._id,
        seers: [],
      };
      expect2 = {
        senderId: users[0]._id,
        type: 'text',
        content: test2.content,
        directChatId: directChat._id,
        seen: false,
      };

      resetDatabase();

      sinon.stub(Meteor, 'user', () => users[0]);
      sinon.stub(Meteor, 'userId', () => users[0]._id);
      sinon.stub(Push, 'send', (obj) => {
        title = obj.title;
        text = obj.text;
        query = obj.query;
      });

      users.forEach((user) => {
        Meteor.users.insert(user);
      });
      Teams.insert(team);
      Boards.insert(board);
      DirectChats.insert(directChat);
      messages.forEach((message) => {
        Messages.insert(message);
      });

      done();
    });

    afterEach((done) => {
      Meteor.user.restore();
      Meteor.userId.restore();
      Push.send.restore();
      done();
    });

    it('should send a message', (done) => {
      sendMessage.call(test1, (error, result1) => {
        if (error) throw new Meteor.Error(error);
        sendMessage.call(test2, (error, result2) => {
          if (error) throw new Meteor.Error(error);

          expect1.createdAt = result1.createdAt;
          expect2.createdAt = result2.createdAt;

          chai.assert.deepEqual(expect1, result1);
          chai.assert.deepEqual(expect2, result2);

          done();
        });
      });
    });

    it('should see a message in a directChat', (done) => {
      const expected = messages[0];
      expected.seen = true;

      seeMessage.call({ messageId: messages[0]._id }, (error, result) => {
        if (error) throw new Meteor.Error(error);
        chai.assert.deepEqual(result, expected);
        done();
      });
    });

    it('should see a message in a board', (done) => {
      const expected = messages[1];
      expected.seers.push(users[0]._id);

      seeMessage.call({ messageId: messages[1]._id }, (error, result) => {
        chai.assert.deepEqual(result, expected);
        done();
      });
    });

    it('should show a notification correctly', (done) => {
      sendMessage.call(test1, (error, result) => {
        if (error) throw new Meteor.Error(error);
        const expectText = `${users[0].profile.name}: ${test1.content}`;
        const expectQuery = {
          userId: {
            $in: [users[1]._id],
          }
        };

        chai.assert.equal(board.name, title);
        chai.assert.equal(expectText, text);
        chai.assert.deepEqual(expectQuery, query);

        sendMessage.call(test2, (error, result) => {
          if (error) throw new Meteor.Error(error);
          const expectQuery = {
            userId: users[1]._id,
          };

          chai.assert.equal(users[1].profile.name, title);
          chai.assert.equal(test2.content, text);
          chai.assert.deepEqual(expectQuery, query);

          done();
        });
      });
    });
  });
}
