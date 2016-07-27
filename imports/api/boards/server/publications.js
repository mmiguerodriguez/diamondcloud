import { Meteor }   from 'meteor/meteor';

import { Boards }   from '../boards.js';

Meteor.publishComposite('boards.board', function(boardId) {
  if (!this.userId) {
    throw new Meteor.Error('Boards.publication.board.notLoggedIn',
    'Must be logged in to view boards.');
  }
  return {
    find: function() {
      return Boards.getBoards([boardId], this.userId, Boards.boardFields);
    }
  };
});
