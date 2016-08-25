import { Mongo } from 'meteor/mongo';

import { Teams } from '../teams/teams.js';

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

DirectChats.isValid = (directChatId, userId) => {
	let directChat =  DirectChats.findOne({
    _id: directChatId,
    users: {
      $elemMatch: {
        _id: userId,
      }
    }
  });

  if(!directChat){
    return false;
  }
  else{
    let team = Teams.findOne(directChat.teamId);
    return team.hasUser({ _id: userId });
  }
};
