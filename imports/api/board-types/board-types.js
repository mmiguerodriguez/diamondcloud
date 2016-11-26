import { Mongo }      from 'meteor/mongo';

import { Boards } from '../boards/boards';

export const BoardTypes = new Mongo.Collection('BoardTypes');

const boardTypes = [
  {
    name: 'test1',
    permissions: [
      'hasHideButton',
    ],
  },
  {
    name: 'test2',
    permissions: [],
  },
];

if (BoardTypes.find().count() < boardTypes.length) {
  boardTypes.forEach((boardType) => {
    if (!BoardTypes.findOne(boardType._id)) {
      BoardTypes.insert(boardType);
    }
  });
}

/**
 * Returns the boards by boardType
 *
 * @param {Array} boardTypeId
 * @returns {Object} boards
 */
BoardTypes.getBoardsByType = boardTypeId => (
  Boards.find({ boardType: boardTypeId }).fetch()
);
