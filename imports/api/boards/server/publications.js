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
      return Boards.find({
        _id: boardId,
        $or: [ // check that current user is allowed to view the board
          { isPrivate: false },
          {
            users: {
              $elemMatch: {
                _id: this.userId,
              }
            }
          }
        ],
        archived: false,
      }, { 
        fields: Boards.boardFields, 
      });
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