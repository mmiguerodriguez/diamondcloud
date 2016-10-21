import { Mongo }  from 'meteor/mongo';

import { Boards } from '../boards/boards';

export const ModuleInstances = new Mongo.Collection('ModuleInstances');

ModuleInstances.helpers({
  board(fields = {}) {
    return Boards.findOne({
      'moduleInstances._id': this._id,
    }, { fields });
  },
});

/**
 * Inserts many moduleInstances to the database to prevent
 * doing a forEach of callbacks when we are inserting
 * a certain type of board in the database.
 *
 * After inserting the moduleInstances we add the inserted
 * ids to the board.moduleInstances attribute.
 *
 * @param {Array} moduleInstances
 *  The moduleInstances we are inserting.
 * @param {String} boardId
 *  The board id in where we are inserting
 *  the moduleInstances.
 */
ModuleInstances.insertManyInstances = (moduleInstances, boardId, callback) => {
  const promises = [];

  moduleInstances.forEach((moduleInstance) => {
    const promise = new Promise((resolve, reject) => {
      ModuleInstances.insert(moduleInstance, (error, result) => {
        const moduleInstanceId = result;

        if (error) {
          reject(error, false);
        } else {
          Boards.addModuleInstance(boardId, moduleInstanceId);
          resolve(true);
        }
      });
    });

    promises.push(promise);
  });

  /**
   * Iterate through the promises array and return a final
   * callback checking if all promises passed the tests
   */
  Promise.all(promises)
    .then((result) => {
      callback(null, result);
    }, (error, result) => {
      callback(error, result);
    });
};
