import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Drawings } from './drawings.js';

export const createDrawing = new ValidatedMethod({
  name: 'Drawings.methods.create',
  validate: new SimpleSchema({
    x: { type: Number },
    y: { type: Number }
  }).validator(),
  run({ x, y }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Drawings.methods.create.notLoggedIn', 
      'Must be logged in to make a drawing.');
    }
    
    let drawing = {
      x,
      y,
      archived: false,
    };
    
    Drawings.insert(drawing);
    return drawing;
  }
});

export const archiveDrawing = new ValidatedMethod({
  name: 'Drawings.methods.archive',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id, },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Drawings.methods.archive.notLoggedIn', 
      'Must be logged in to archive a drawing.');
    }
    
    Drawings.update(_id, {
      $set: { 
        archived: true, 
      }
    });
    
    let drawing = Drawings.findOne(_id);
    return drawing;
  }
});

export const dearchiveDrawing = new ValidatedMethod({
  name: 'Drawings.methods.unarchive',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id, },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Drawings.methods.dearchive.notLoggedIn', 
      'Must be logged in to dearchive a drawing.');
    }
    
    Drawings.update(_id, {
      $set: { 
        archived: false, 
      }
    });
    
    let drawing = Drawings.findOne(_id);
    return drawing;
  }
});