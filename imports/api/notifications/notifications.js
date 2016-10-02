import { DirectChats } from '../direct-chats/direct-chats.js';
import { Boards }      from '../boards/boards.js';
/*
Push.debug = true;
Push.allow({
  send(userId, notification) {
    return true;
  }
});
*/
export const Notifications = {
  send({ directChatId, boardId, message }) {
    let sender = 'Diamond Cloud', title, text, query;

    if(!!directChatId) {
      let directChat = DirectChats.findOne(directChatId);

      title = Meteor.user().profile.name;
      text = message.content;
      query = {
        userId: directChat.getUser()._id,
      };
    } else if(!!boardId) {
      let board = Boards.findOne(boardId);
      let boardUsers = board.getUsers();
      let sender = Meteor.users.findOne(message.senderId);

      title = board.name;
      text = sender.profile.name + ': ' + message.content;

      if(boardUsers.length > 0) {
        query = {
          userId: {
            $in: boardUsers,
          }
        };
      } else {
        // No users on board
        return;
      }
    }

    let notification = {
      from: sender,
      title,
      text,
      query,
      gcm: {
        style: 'inbox',
        summaryText: 'There are %n% notifications',
      }
    };

    Push.send(notification);
  },
};
