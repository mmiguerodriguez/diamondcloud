import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Modules } from './modules.js';

export const createModule = new ValidatedMethod({
  name: 'Modules.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    img: { type: String },
    description: { type: String },
    validated: { type: Boolean },
  }).validator(),
  run({ name, img, description, validated }) {
    let module = {
      name,
      img,
      description,
      validated
    };

    Modules.insert(module);
    return module;
  }
});
