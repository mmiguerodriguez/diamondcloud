import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

Meteor.publish('boards', function() {
  return ModuleInstances.find();
});