export let generateApi = (moduleInstanceId) => {
  return {
    subscribe: (obj, callback) => {
      // Validation.
      //cosa
      let validation = typeof obj.collection == 'string';
      validation = validation && typeof obj.condition == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        // Subscribe to data
        Meteor.subscribe('moduleInstances.data', moduleInstanceId, obj, {
          onReady: callback,
          onError: (err) => {
            throw console.error('Error while subscribing.', err);
          },
        });
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    insert: ({ collection, obj, visibleBy, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof obj == 'object';
      validation = validation && typeof visibleBy == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        Meteor.call('ModuleInstances.methods.apiInsert', {
          moduleInstanceId,
          collection,
          obj,
          visibleBy,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
    update: ({ collection, filter, updateQuery, callback }) => {
      // Validation.
      let validation = typeof collection == 'string';
      validation = validation && typeof filter == 'object';
      validation = validation && typeof updateQuery == 'object';
      validation = validation && (typeof callback == 'function' || typeof callback == 'undefined');
      if (validation) {
        filter = {
          id: 'id',
        };
        updateQuery = {
          prop1: 'val1',
          prop2:'val2',
        };
        for(let property in filter) {// Property will be the name

        }
        Meteor.call('ModuleInstances.methods.apiInsert', {
          moduleInstanceId,
          collection,
          obj,
          visibleBy,
        }, callback);
      } else {
        throw console.error('The provided data is wrong.');
      }
    },
  };
};

let generateMongoQuery = (input, collection) => {
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
      result[`data.${collection}.${propertyName}`] = input[propertyName];
    } else {
      result[propertyName] = input[propertyName];
    }

    if(Array.isArray(input[propertyName])) {
      result[isOperator ? propertyName : `data.${collection}.${propertyName}`].forEach((element, index, array) => {
        if(typeof element === 'object') {
          array[index] = generateMongoQuery(element, collection);
        } else {
          array[index] = element;
        }
      });
    }
  }
  return result;
};
