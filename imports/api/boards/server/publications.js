import { Meteor }   from 'meteor/meteor';

import { Boards }   from '../boards.js';

Meteor.publishComposite('boards.board', function(boardId) {
  if (!this.userId) {
    throw new Meteor.Error('Boards.publication.board.notLoggedIn',
    'Must be logged in to view boards.');
  }
  
  let board = Boards.findOne(boardId);

  if (!board){
    throw new Meteor.Error('Boards.publication.board.boardDoesNotExist',
    'There is no board with given id.');
  }

  if (!board.team().hasUser({ _id: this.userId })){
    throw new Meteor.Error('Boards.publication.board.userDoesNotBelongToTeam',
    'You must be in the team to view one of its boards.');
  }

  return {
    find: function() {
      return Boards.getBoards([boardId], this.userId, Boards.boardFields);
    },
    children: [
      {
        find: function(board) {
          return board.getModuleInstances(Boards.moduleInstancesFields);
        }
      }
    ]
  };
});
