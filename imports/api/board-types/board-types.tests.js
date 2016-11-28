import { Meteor }        from 'meteor/meteor';
import { assert }        from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory }       from 'meteor/dburles:factory';

import { BoardTypes }    from '../board-types/board-types';
import                        '../factories/factories';

if (Meteor.isServer) {
  describe('BoardsTypes', () => {
    let boards;
    let boardTypes;
    before(() => {
      resetDatabase();

      boardTypes = [
        Factory.create('boardType'),
        Factory.create('boardType'),
      ];
      boards = [
        Factory.create('board', { boardTypeId: boardTypes[0]._id }),
        Factory.create('board', { boardTypeId: boardTypes[0]._id }),
        Factory.create('board', { boardTypeId: boardTypes[1]._id }),
        Factory.create('board', { boardTypeId: boardTypes[1]._id }),
      ];
    });

    describe('Interfaces', () => {
      it('should return the boards by type', () => {
        const result = BoardTypes.getBoardsByType(boardTypes._id);
        const expect = [
          boards[0],
          boards[1],
        ];
        assert(result, expect);
      });
    });
  });
}
