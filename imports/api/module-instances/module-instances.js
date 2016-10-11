import { Mongo }  from 'meteor/mongo';

import { Boards } from '../boards/boards.js';

export let ModuleInstances = new Mongo.Collection('ModuleInstances');

ModuleInstances.helpers({
  board(fields) {
    fields = fields || {};
    return Boards.findOne({
      'moduleInstances._id': this._id,
    }, { fields });
  }
});

export let generateMongoQuery = (input, collection) => {
  /*Example input:
  {
    prop1: 'val1',
    prop2:'val2',
    $and: [
      {
        $or: [
          { prop3: 1 },
          { prop3: 2 },
        ],
      },
      {
        $or: [
          {
            prop4: {
              $in: [5, 10],
            },
          },
          {
            prop5: {
              $in: [20, 40],
            },
          },
        ],
      }
    ]
  }
  */
  let result = {};
  for(let property in input) {
    // If property starts with '$', it's an operator, so ignore it
    let isOperator = property.charAt(0) === '$';
    
    if (!isOperator) {
      result[`data.${ collection }.$.${ property }`] = input[property];
    } else {
      result[property] = input[property];
    }

    let index = isOperator ? property : `data.${ collection }.$.${ property }`;

    if (Array.isArray(input[property])) {
      result[index].forEach((element, i, array) => {
        if (typeof element === 'object') {
          array[i] = generateMongoQuery(element, collection);
        } else {
          array[i] = element;
        }
      });
    } else if (typeof input[property] === 'object') {
      let flags = input[property].$flags;
      
      // If consumer passed a flags element then check attributes
      if (flags) {
        if (!flags.insertAsPlainObject) {
          result[index] = generateMongoQuery(result[index], collection);
        }
        
        // Delete the flags object so it doesn't get inserted
        delete result[index].$flags;
      } else {
        result[index] = generateMongoQuery(result[index], collection);
      }
    }
  }
  return result;
};

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
  let promises = [];

  moduleInstances.forEach((moduleInstance) => {
    let promise = new Promise((resolve, reject) => {
      ModuleInstances.insert(moduleInstance, (error, result) => {
        let moduleInstanceId = result;
  
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
