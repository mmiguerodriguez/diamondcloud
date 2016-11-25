import { Mongo } from 'meteor/mongo';

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
