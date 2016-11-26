import { Mongo }        from 'meteor/mongo';
import { Factory }      from 'meteor/dburles:factory';
import faker		        from 'faker';

import { Modules }      from '../modules/modules';
import readModuleConfig from '../helpers/read-module-config';

export const Permissions = new Mongo.Collection('Permissions');

Permissions.helpers({
  
});

Modules.find().fetch().forEach((module) => {
  readModuleConfig(module._id)
  .then((result) => {
    const { settings } = result;
    
    console.log(result);
    
    settings.permissions.forEach((permission) => {
      Permissions.insert(permission);
    });

    settings.boardTypeProps.forEach((prop) => {
      console.log('prop', prop);
      // BoardTypeProps.insert(prop);
    });
  }, (error) => {
    console.log('error', error);
  });
});

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

Factory.define('permission', Permissions, {
  key: () => faker.lorem.word(),
  name: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
});
