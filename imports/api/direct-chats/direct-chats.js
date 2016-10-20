import { Meteor }   from 'meteor/meteor';
import { Mongo }    from 'meteor/mongo';

import { Teams }    from '../teams/teams';
import { Messages } from '../messages/messages';

export const DirectChats = new Mongo.Collection('DirectChats');

DirectChats.helpers({
  getMessages() {
    return Messages.find({
      directChatId: this._id,
    }, {
      sort: {
        createdAt: 1,
      },
    });
  },

  getLastMessage() {
    const messages = this.getMessages().fetch();
    return messages[messages.length - 1] || { content: '' };
  },

  getUser() {
    let user;

    this.users.forEach((_user) => {
      if (_user._id !== Meteor.userId()) {
        user = Meteor.users.findOne(_user._id);
      }
    });

    return user;
  },

  getNotifications() {
    let notifications;

    this.users.forEach((_user) => {
      if (_user._id === Meteor.userId()) {
        notifications = _user.notifications;
      }
    });

    return notifications || 0;
  },
});

DirectChats.getUserDirectChats = (userId, teamId) => {
  return DirectChats.find({
    teamId,
    users: {
      $elemMatch: {
        _id: userId,
      },
    },
  });
};

DirectChats.isValid = (directChatId, userId) => {
  const directChat = DirectChats.findOne({
    _id: directChatId,
    users: {
      $elemMatch: {
        _id: userId,
      },
    },
  });

  if (!directChat) {
    return false;
  }

  const team = Teams.findOne(directChat.teamId);
  return team.hasUser({ _id: userId });
};

DirectChats.addNotification = (directChatId, userId) => {
  const users = DirectChats.findOne(directChatId).users;
  users.forEach((user, index) => {
    if (user._id !== userId) {
      users[index].notifications = user.notifications + 1;
    }
  });

  DirectChats.update(directChatId, {
    $set: {
      users,
    },
  });
};

DirectChats.resetNotifications = (directChatId, userId) => {
  const users = DirectChats.findOne(directChatId).users;
  users.forEach((user, index) => {
    if (user._id !== userId) {
      users[index].notifications = 0;
    }
  });

  DirectChats.update(directChatId, {
    $set: {
      users,
    },
  });
};
