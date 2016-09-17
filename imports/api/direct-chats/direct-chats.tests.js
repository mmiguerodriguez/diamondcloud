import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { DirectChats }   from './direct-chats.js';
import { Teams }         from '../teams/teams.js';
import { Messages }        from '../messages/messages.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('DirectChats', function() {
    describe('Helpers', function() {
      let users, teams, directChats, messages;
      function getNotifications(directChatId, userId) {
        return DirectChats.findOne(directChatId).users.find((user) => {
          return user._id !== userId;
        }).notifications;
      }

      beforeEach(function() {
        resetDatabase();

        users = [
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
          Factory.create('user', { _id: Random.id(), emails: [{ address: faker.internet.email() }] }),
        ];
        teams = [
          Factory.create('team', {
            users: [
              { email: users[0].emails[0].address, permission: 'owner' },
              { email: users[1].emails[0].address, permission: 'member' },
            ],
          }),
          Factory.create('team', {
            users: [
              { email: users[1].emails[0].address, permission: 'owner' },
              { email: users[2].emails[0].address, permission: 'member' },
            ],
          }),
          Factory.create('team', {
            users: [
              { email: users[2].emails[0].address, permission: 'owner' },
              { email: users[3].emails[0].address, permission: 'member' },
            ],
          }),
          Factory.create('team', {
            users: [
              { email: users[0].emails[0].address, permission: 'owner' },
              { email: users[3].emails[0].address, permission: 'member' },
            ],
          }),
        ];
        directChats = [
          Factory.create('directChat', {
            teamId: teams[0]._id,
            users: [
              { _id: users[0]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
              { _id: users[1]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
            ]
          }),
          Factory.create('directChat', {
            teamId: teams[1]._id,
            users: [
              { _id: users[1]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
              { _id: users[2]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
            ]
          }),
          Factory.create('directChat', {
            teamId: teams[2]._id,
            users: [
              { _id: users[2]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
              { _id: users[3]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
            ]
          }),
          Factory.create('directChat', {
            teamId: teams[3]._id,
            users: [
              { _id: users[0]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
              { _id: users[3]._id, notifications: faker.random.number({ min: 1, max: 20 }) },
            ]
          }),
        ];
        messages = [];
        
        for(let i = 0; i < 3; i++) {
          messages.push(Factory.create('directChatMessage'));
          messages[i].directChatId = directChats[0]._id;
        }

        resetDatabase();

        users.forEach((user) => {
          Meteor.users.insert(user);
        });
        teams.forEach((team) => {
          Teams.insert(team);
        });
        directChats.forEach((directChat) => {
          DirectChats.insert(directChat);
        });
        messages.forEach((message) => {
          Messages.insert(message);
        });
        
        sinon.stub(Meteor, 'user', () => users[0]);
        sinon.stub(Meteor, 'userId', () => users[0]._id);
      });
      
      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
      });
      
      it('should return the messages of a direct chat', function() {
        let directChat = DirectChats.findOne(directChats[0]._id);
        chai.assert.equal(directChat.getMessages().count(), messages.length);
      });

      it('should return if a direct-chat is valid', function() {
        chai.assert.isTrue(DirectChats.isValid(directChats[0]._id, users[0]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[0]._id, users[1]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[0]._id, users[2]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[0]._id, users[3]._id));

        chai.assert.isFalse(DirectChats.isValid(directChats[1]._id, users[0]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[1]._id, users[1]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[1]._id, users[2]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[1]._id, users[3]._id));

        chai.assert.isFalse(DirectChats.isValid(directChats[2]._id, users[0]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[2]._id, users[1]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[2]._id, users[2]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[2]._id, users[3]._id));

        chai.assert.isTrue(DirectChats.isValid(directChats[3]._id, users[0]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[3]._id, users[1]._id));
        chai.assert.isFalse(DirectChats.isValid(directChats[3]._id, users[2]._id));
        chai.assert.isTrue(DirectChats.isValid(directChats[3]._id, users[3]._id));
      });
      it('should return user direct-chats', function() {
        let foundChats = [
          ...DirectChats.getUserDirectChats(users[0]._id, teams[0]._id).fetch(),
          ...DirectChats.getUserDirectChats(users[0]._id, teams[3]._id).fetch(),
        ];

        let realChats = [
          directChats[0],
          directChats[3],
        ];

        chai.assert.deepEqual(foundChats, realChats);
      });
      it('should add a notification to the direct-chat', function() {
        let startNotifications, endNotifications;

        startNotifications = getNotifications(directChats[0]._id, users[0]._id);
        DirectChats.addNotification(directChats[0]._id, users[0]._id);
        endNotifications = getNotifications(directChats[0]._id, users[0]._id);

        chai.assert.notEqual(startNotifications, endNotifications);
        chai.assert.equal(startNotifications + 1, endNotifications);
      });
      it('should reset notifications from the direct-chat', function() {
        let startNotifications, endNotifications;

        startNotifications = getNotifications(directChats[0]._id, users[0]._id);
        DirectChats.resetNotifications(directChats[0]._id, users[0]._id);
        endNotifications = getNotifications(directChats[0]._id, users[0]._id);

        chai.assert.notEqual(startNotifications, endNotifications);
        chai.assert.equal(endNotifications, 0);
      });
      it('should return the other user from the direct-chat', function(){
        let directChat = DirectChats.findOne(directChats[0]._id);
        let otherUser = directChat.getUser();
        let expectOtherUser = Meteor.users.findOne(users[1]._id);
        
        chai.assert.deepEqual(otherUser, expectOtherUser);
      });
      it('should return the user notifications from the direct-chat', function() {
        let directChat = DirectChats.findOne(directChats[0]._id);
        let notifications = directChat.getNotifications();
        let expectNotifications = directChats[0].users[0].notifications;
        
        chai.assert.equal(notifications, expectNotifications);
      });
      it('should return the last message from the direct-chat', function() {
        let directChat = DirectChats.findOne(directChats[0]._id);
        let lastMessage = directChat.getLastMessage();
        let expectMessage = messages[2];
                console.log(JSON.stringify(lastMessage), JSON.stringify(expectMessage));
        chai.assert.deepEqual(lastMessage, expectMessage);
      });
    });
  });
}
