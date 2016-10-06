import { Mongo }                   from 'meteor/mongo';

export let APICollection = new Mongo.Collection('APICollection');

APICollection.generateMongoQuery = (input) => {
  let result = {};

  for (let prop in input) {
    result[`API_${prop}`] = input[prop];
  }

  return result;
};

APICollection.cleanAPIData = (input) => {
  let result = {};
  
  for (let prop in input) {
    if (prop.substring(0, 4) == "API_") {
      result[prop.substring(5, prop.length)] = input[prop];
    }
  }
  
  if (!result._id) {
    result._id = input._id;
  }
  
  return result;
}