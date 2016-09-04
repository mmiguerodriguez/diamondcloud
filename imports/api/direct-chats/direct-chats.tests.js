import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { DirectChats }   from './direct-chats.js';
import { Teams }         from '../teams/teams.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('DirectChats', function() {
    let users, teams, directChats;
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
            { _id: users[0]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
            { _id: users[1]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
          ]
        }),
        Factory.create('directChat', {
          teamId: teams[1]._id,
          users: [
            { _id: users[1]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
            { _id: users[2]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
          ]
        }),
        Factory.create('directChat', {
          teamId: teams[2]._id,
          users: [
            { _id: users[2]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
            { _id: users[3]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
          ]
        }),
        Factory.create('directChat', {
          teamId: teams[3]._id,
          users: [
            { _id: users[0]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
            { _id: users[3]._id, notifications: faker.random.number({ min: 0, max: 20 }) },
          ]
        }),
      ];

      resetDatabase();

      users.forEach((user) => Meteor.users.insert(user));
      teams.forEach((team) => Teams.insert(team));
      directChats.forEach((directChat) => DirectChats.insert(directChat));
    });

    afterEach(function() {

    });

    it('should check if a direct-chat is valid', function() {
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
    it('should get user direct-chats', function() {
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
    it('should add a notification of user direct-chat', function() {
      let startNotifications, endNotifications;

      startNotifications = getNotifications(directChats[0]._id, users[0]._id);
      DirectChats.addNotification(directChats[0]._id, users[0]._id);
      endNotifications = getNotifications(directChats[0]._id, users[0]._id);

      chai.assert.notEqual(startNotifications, endNotifications);
      chai.assert.equal(startNotifications + 1, endNotifications);
    });
    it('should reset notifications of user direct-chat', function() {
      let startNotifications, endNotifications;

      startNotifications = getNotifications(directChats[0]._id, users[0]._id);
      DirectChats.resetNotifications(directChats[0]._id, users[0]._id);
      endNotifications = getNotifications(directChats[0]._id, users[0]._id);

      chai.assert.notEqual(startNotifications, endNotifications);
      chai.assert.equal(endNotifications, 0);
    });
  });
}
