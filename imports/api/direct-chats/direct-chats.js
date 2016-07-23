import { Mongo } from 'meteor/mongo';

export let DirectChats = new Mongo.Collection('DirectChats');

DirectChats.getUserDirectChats = (userId, teamId) => {
	return DirectChats.find({
    teamId, 
    users: { 
      $elemMatch: { 
        _id: userId,
      } 
    }
  });
};