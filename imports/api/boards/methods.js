import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Boards } from './boards.js';
import { Teams } from '../teams/teams.js';

export const createBoard = new ValidatedMethod({
  name: 'Boards.methods.create',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    isPrivate: { type: Boolean },
    users: { type: [Object], optional: true },
    'users.$._id': { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
  }).validator(),
  run({ teamId, name, isPrivate, users }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.createBoard.notLoggedIn',
      'Must be logged in to create a board.');
    }
  
    let team = Teams.findOne(teamId);
    users = users || [];

    if(users.length > 0 && isPrivate) {
      users.forEach((user) => {
        if (!team.hasUser({ _id: user._id })) {
          throw new Meteor.Error('Branches.methods.createBoard.userNotInTeam',
          'You cannot add people to a board that are not part of the team.');
        }
      });
    }
  
    let board = {
      name,
      isPrivate,
      users,
      moduleInstances: [],
      drawings: [],
      archived: false,
    };
    
    Boards.insert(board);
    return board;
  }
});

export const archiveBoard = new ValidatedMethod({
  name: 'Boards.methods.archiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.archiveBoard.notLoggedIn',
      'Must be logged in to archive a board.');
    }
    
    let board;
    
    Boards.update(_id, { 
      $set: {
        archived: true, 
      }
    });
    
    board = Boards.findOne(_id);
    return board;
  },
});

export const dearchiveBoard = new ValidatedMethod({
  name: 'Boards.methods.dearchiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.dearchiveBoard.notLoggedIn',
      'Must be logged in to dearchive a board.');
    }
    
    let board;
    
    Boards.update(_id, { 
      $set: {
        archived: false, 
      }
    });
    
    board = Boards.findOne(_id);
    return board;
  },
});