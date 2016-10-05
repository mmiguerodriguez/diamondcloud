import { Mongo }                   from 'meteor/mongo';

export let APICollection = new Mongo.Collection('APICollection');

APICollection.generateMongoQuery = (input) => {
  let result;
  
  for (let prop in input) {
    result[`API.${prop}`] = input[prop];
  }
  
  return result;
};
