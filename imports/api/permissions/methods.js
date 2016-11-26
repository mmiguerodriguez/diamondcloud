import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Permissions }     from './permissions';

export const createPermission = new ValidatedMethod({
  name: 'Permissions.methods.create',
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    key: {
      type: String,
    },
    description: {
      type: String,
    },
  }).validator(),
  run({ name, description, key }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Permissions.methods.create.notLoggedIn',
      'Must be logged in to create a permission.');
    }

    const permission = {
      key,
      name,
      description,
    };

    const exists = Permissions.findOne({
      $or: [
        { key },
        { name },
        { description },
      ],
    });

    if (exists) {
      throw new Meteor.Error('Permissions.methods.create.permissionExists',
      'This permission name already exists.');
    }

    Permissions.insert(permission);
  },
});
