import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { Modules }         from './modules';

export const createModule = new ValidatedMethod({
  name: 'Modules.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    img: { type: String },
    description: { type: String },
    settings: { type: Object, blackbox: true },
    validated: { type: Boolean },
  }).validator(),
  run({ name, img, description, settings, validated }) {
    const module = {
      name,
      img,
      description,
      settings,
      validated,
    };

    Modules.insert(module);
    return module;
  },
});
