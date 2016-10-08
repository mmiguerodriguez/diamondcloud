import { Mongo }                   from 'meteor/mongo';

export let APICollection = new Mongo.Collection('APICollection');

APICollection.generateMongoQuery = (input) => {
  let result = {};

  for (let prop in input) {
    result[`API_${prop}`] = input[prop];
  }

  /* jshint ignore:start */
  if (!!result['API__id']) {
    result._id = result['API__id'];
    delete result['API__id'];
  }
  /* jshint ignore:end */

  return result;
};

APICollection.generateMongoQueryRecursively = (input) => {
  if (input.constructor === Array) {
    return input.map((e) => {
      return APICollection.generateMongoQueryRecursively(e);
    });
  }
  else if (typeof input == 'object') {
    let result = {};

    for (let i in input) {
      if (i[0] != '$') {
        result[`API_${i}`] = APICollection.generateMongoQueryRecursively(input[i]);
      } else {
        result[i] = APICollection.generateMongoQueryRecursively(input[i]);
      }
    }

    /* jshint ignore:start */
    if (!!result['API__id']) {
      result._id = result['API__id'];
      delete result['API__id'];
    }
    /* jshint ignore:end */

    return result;
  } else {
    return input;
  }
};

APICollection.cleanAPIData = (input) => {
  let result = {};

  for (let prop in input) {
    if (prop.substring(0, 4) == "API_") {
      result[prop.substring(4, prop.length)] = input[prop];
    }
  }

  if (!result._id) {
    result._id = input._id;
  }

  return result;
};
