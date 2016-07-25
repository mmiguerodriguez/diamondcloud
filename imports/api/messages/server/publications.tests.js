import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import { Messages }             from '../messages.js';
import { DirectChats }          from '../../direct-chats/direct-chats.js';
import { Boards }               from '../../boards/boards.js';

if (Meteor.isServer) {
  let user = {
    _id: Random.id(),
    emails: [
      { address: faker.internet.email() }
    ]
  };

  describe('Messages', function() {
    describe('Publications', function() {
      let directChatWithUser = {
            _id: Random.id(),
            teamId: Random.id(),
            users: [
              { _id: Random.id() },
              { _id: user._id }
            ],
          },
          directChatWithoutUser = {
            _id: Random.id(),
            teamId: Random.id(),
            users: [
              { _id: Random.id() },
              { _id: Random.id() }
            ],
          },
          privateBoardWithUser = {
            _id: Random.id(),
            name: faker.lorem.word(),
            isPrivate: true,
            users: [
              { _id: user._id }
            ],
          },
          privateBoardWithoutUser = {
            _id: Random.id(),
            name: faker.lorem.word(),
            isPrivate: true,
            users: [
              { _id: Random.id() }
            ],
      },
          publicBoard = {
            _id: Random.id(),
            name: faker.lorem.word(),
            isPrivate: false,
          },
          messages = [
            {
              directChatId: directChatWithUser._id,
              senderId: user._id,
              type: 'text',
              content: 'Direct chat with User',
            },
            {
              directChatId: directChatWithUser._id,
              senderId: user._id,
              type: 'text',
              content: 'Direct chat with User 2',
            },
            {
              boardId: privateBoardWithUser._id,
              senderId: user._id,
              type: 'text',
              content: 'Private board with User',
            },{
              boardId: privateBoardWithUser._id,
              senderId: user._id,
              type: 'text',
              content: 'Private board with User 2',
            },
            {
              boardId: publicBoard._id,
              senderId: user._id,
              type: 'text',
              content: 'Public board',
            },
            {
              boardId: publicBoard._id,
              senderId: user._id,
              type: 'text',
              content: 'Public board 2',
            },
          ];

      beforeEach(function() {
        resetDatabase();

        DirectChats.insert(directChatWithUser);
        DirectChats.insert(directChatWithoutUser);

        Boards.insert(privateBoardWithUser);
        Boards.insert(privateBoardWithoutUser);
        Boards.insert(publicBoard);

        messages.forEach((message) => {
          Messages.insert(message);
        });

        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should publish the messages of a direct chat in which the user is in', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('messages.chat', { directChatId: directChatWithUser._id }, (collections) => {
          chai.assert.isTrue(collections.Messages.length == 2);
          done();
        });
      });
      it("should not publish the messages of a direct chat in which the user isn't in", function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        let collect = () => {
              collector.collect('messages.chat', { directChatId: directChatWithoutUser._id }, (collections) => {});
            },
            error;

        try {
          collect();
        } catch(err) {
          error = err;
        }

        chai.assert.isTrue(error.error == 'Messages.chat.wrongParameters');
        done();
      });
      it('should publish the messages of a private board in which the user is in', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('messages.chat', { boardId: privateBoardWithUser._id }, (collections) => {
          chai.assert.isTrue(collections.Messages.length === 2);
          done();
        });
      });
      it("should not publish the messages of a private board in which the user isn't in", function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        let collect = () => {
              collector.collect('messages.chat', { directChatId: privateBoardWithoutUser._id }, (collections) => {});
            },
            error;

        try {
          collect();
        } catch(err) {
          error = err;
        }

        chai.assert.isTrue(error.error == 'Messages.chat.wrongParameters');
        done();
      });
      it('should publish the messages of a public board', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('messages.chat', { boardId: publicBoard._id }, (collections) => {
          chai.assert.isTrue(collections.Messages.length === 2);
          done();
        });
      });
    });
  });
}
