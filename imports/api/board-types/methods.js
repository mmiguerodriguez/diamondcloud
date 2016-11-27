import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';

import { BoardTypes }      from './board-types';

/**
 * Creates a type of board
 *
 * @type {ValidatedMethod}
 * @param {String} name
 * @param {String} teamId
 * @param {Array} properties
 *  @param {String} _id
 */
export const createBoardType = new ValidatedMethod({
  name: 'BoardTypes.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    properties: { type: Array },
    'properties._id': { type: String },
  }).validator(),
  run({ name, teamId, properties }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('BoardTypes.methods.create.notLoggedIn',
      'Must be logged in to create a type of board.');
    }

    // TODO: check name, teamId and properties

    const boardType = {
      name,
      teamId,
      properties,
    };

    BoardTypes.insert(boardType);
  },
});
