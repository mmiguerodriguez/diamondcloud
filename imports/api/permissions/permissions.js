import { Mongo }   from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { Random }  from 'meteor/random';
import faker		   from 'faker';

export let Permissions = new Mongo.Collection('Permissions');

/**
 * Permissions
 * - access_all_boards
 * - access_visible_boards
 * - 
 */

const permissions = [

];

if (Permissions.find().count() < permissions.length) {
  permissions.forEach((permission) => {
    if (!Permissions.findOne(permission._id)) {
      Permissions.insert(permission);
    }
  });
}

Permissions.helpers({
  
});

Factory.define('permission', Permissions, {
  key: () => faker.lorem.word(),
  name: () => faker.lorem.word(),
});
