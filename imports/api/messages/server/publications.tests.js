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
import { Teams }               from '../../teams/teams.js';

import '../../factories/factories.js';

if (Meteor.isServer) {
  let user, directChatWithUser, directChatWithoutUser, privateBoardWithUser,
      privateBoardWithoutUser, publicBoard, messages, teamWithUser,
      teamWithoutUser, teamWithoutUserPublicBoard;
  describe('Messages', function() {
    describe('Publications', function() {
      
      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');
        teamWithUser = Factory.create('team');
        teamWithUser.users[0].email = user.emails[0].address;

        teamWithoutUser = Factory.create('team');
        teamWithoutUserPublicBoard = Factory.create('publicBoard');
        teamWithoutUser.boards.push({ _id: teamWithoutUserPublicBoard._id });

        directChatWithUser = Factory.create('directChat', { teamId: teamWithUser._id });
        directChatWithUser.users[0]._id = user._id;

        directChatWithoutUser = Factory.create('directChat', { teamId: teamWithUser._id });

        publicBoard = Factory.create('publicBoard');
        teamWithUser.boards.push({ _id: publicBoard._id });

        privateBoardWithUser = Factory.create('privateBoard');
        privateBoardWithUser.users[0].email = user.emails[0].address;
        teamWithUser.boards.push({ _id: privateBoardWithUser._id });

        privateBoardWithoutUser = Factory.create('privateBoard');
        teamWithUser.boards.push({ _id: privateBoardWithoutUser._id });

        messages = [
          Factory.create('directChatMessage'),//directChatWithUser
          Factory.create('boardMessage'),//publicBoard
          Factory.create('boardMessage'),//privateBoardWithUser
        ];
        messages[0].directChatId = directChatWithUser._id;
        messages[1].boardId = publicBoard._id;
        messages[2].boardId = privateBoardWithUser._id;
        resetDatabase();
        
        Meteor.users.insert(user);

        Teams.insert(teamWithUser);
        Teams.insert(teamWithoutUser);

        DirectChats.insert(directChatWithUser);
        DirectChats.insert(directChatWithoutUser);

        Boards.insert(privateBoardWithUser);
        Boards.insert(privateBoardWithoutUser);
        Boards.insert(publicBoard);

        Boards.insert(teamWithoutUserPublicBoard);

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
          chai.assert.equal(collections.Messages.length, 1);
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
        chai.assert.equal(error.error, 'Messages.chat.wrongParameters');
        done();
      });
      it('should publish the messages of a private board in which the user is in', function(done) {
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('messages.chat', { boardId: privateBoardWithUser._id }, (collections) => {
          chai.assert.equal(collections.Messages.length, 1);
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
          chai.assert.equal(collections.Messages.length, 1);
          done();
        });
      });
      it("should not publish the messages of a public board in which the user isn't in", function(done){
        const collector = new PublicationCollector({ userId: user._id });
        
        let collect = () => {
              collector.collect('messages.chat', { boardId: teamWithoutUserPublicBoard._id }, (collections) => {});
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
    });
  });
}
