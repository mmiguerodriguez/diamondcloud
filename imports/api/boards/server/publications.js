import { Meteor }   from 'meteor/meteor';

import { Boards }   from '../boards.js';
import { Drawings } from '../../drawings/drawings.js';

Meteor.publishComposite('boards.board', function(boardId) {
  if (!this.userId) {
    throw new Meteor.Error('Boards.publication.board.notLoggedIn',
    'Must be logged in to view boards.');
  }
  return {
    find: function() {
      return Boards.getBoards([boardId], this.userId, Boards.boardFields);
    },
    children: [{
      find: function(board) {
        let drawingsIds = [];
        board.drawings = board.drawings || [];
        
        if (!!board.drawings){
          board.drawings.forEach((drawing) => {
            drawingsIds.push(drawing._id);
          });
        }
        
        return Drawings.find({
          _id: { 
            $in: drawingsIds, 
          },
          archived: false,
        });
      },
    }]
  };
});