import { Mongo }		from 'meteor/mongo';

import { Teams }		from '../teams/teams.js';
import { Messages } from '../messages/messages.js';

export let DirectChats = new Mongo.Collection('DirectChats');

DirectChats.helpers({
	getMessages() {
    return Messages.find({
      directChatId: this._id,
    });
  },
});

DirectChats.getUserDirectChats = (userId, teamId) => {
	return DirectChats.find({
    teamId,
    users: {
      $elemMatch: {
        _id: userId,
      }
    }
  });
};
DirectChats.isValid = (directChatId, userId) => {
	let directChat =  DirectChats.findOne({
    _id: directChatId,
    users: {
      $elemMatch: {
        _id: userId,
      }
    }
  });

  if(!directChat){
    return false;
  } else {
    let team = Teams.findOne(directChat.teamId);
    return team.hasUser({ _id: userId });
  }
};

DirectChats.addNotification = (directChatId, userId) => {
	let users = DirectChats.findOne(directChatId).users;
	users.forEach((user, index, array) => {
		if(user._id !== userId) {
			array[index].notifications = user.notifications + 1;
		}
	});

	DirectChats.update(directChatId, {
		$set: {
			users,
		}
	});
};
DirectChats.resetNotifications = (directChatId, userId) => {
	let users = DirectChats.findOne(directChatId).users;
	users.forEach((user, index, array) => {
		if(user._id !== userId) {
			array[index].notifications = 0;
		}
	});

	DirectChats.update(directChatId, {
		$set: {
			users,
		}
	});
};
