import { Mongo }  from 'meteor/mongo';

import { Boards } from '../boards/boards';

export const BoardTypes = new Mongo.Collection('BoardTypes');

/**
 * Returns the boards by type
 *
 * @param {String} boardTypeId
 * @returns {Object} boards
 */
BoardTypes.getBoardsByType = boardTypeId => (
  Boards.find({ boardType: boardTypeId }).fetch()
);
