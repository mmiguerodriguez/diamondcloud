import { Mongo } from 'meteor/mongo';

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
  for(let propertyName in input) {
    // If property starts with '$', it's an operator, so ignore it
    let isOperator = propertyName.charAt(0) === '$';
    if(!isOperator) {
      result[`data.${collection}.$.${propertyName}`] = input[propertyName];
    } else {
      result[propertyName] = input[propertyName];
    }

    if(Array.isArray(input[propertyName])) {
      result[isOperator ? propertyName : `data.${collection}.$.${propertyName}`].forEach((element, index, array) => {
        if(typeof element === 'object') {
          array[index] = generateMongoQuery(element, collection);
        } else {
          array[index] = element;
        }
      });
    } else if(typeof input[propertyName] === 'object') {
      result[isOperator ? propertyName : `data.${collection}.$.${propertyName}`] =
        generateMongoQuery(result[isOperator ? propertyName : `data.${collection}.$.${propertyName}`], collection);
    }
  }
  return result;
};
