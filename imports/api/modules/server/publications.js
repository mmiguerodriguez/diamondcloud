import { Meteor } from 'meteor/meteor';
import { Modules } from '../modules.js';

Meteor.publish('boards', function() {
  return Modules.find();
});