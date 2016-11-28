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
    'properties.$': { type: String },
  }).validator(),
  run({ name, teamId, properties }) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('BoardTypes.methods.create.notLoggedIn',
      'Must be logged in to create a type of board.');
    }

    const key = 'create_and_archive_board_type';

    if (!user.hasPermission({ teamId, key })) {
      throw new Meteor.Error('BoardTypes.methods.create.notHavePermissions',
      'Must have permissions to create a type of board.');
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

/**
 * Archives a type of board
 *
 * @type {ValidatedMethod}
 * @param {String} boardTypeId
 */
export const archiveBoardType = new ValidatedMethod({
  name: 'BoardTypes.methods.archive',
  validate: new SimpleSchema({
    boardTypeId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ boardTypeId }) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('BoardTypes.methods.archive.notLoggedIn',
      'Must be logged in to archive a type of board.');
    }

    const boardType = BoardTypes.findOne(boardTypeId);
    const teamId = boardType.teamId;
    const key = 'create_and_archive_board_type';

    if (!user.hasPermission({ teamId, key })) {
      throw new Meteor.Error('BoardTypes.methods.archive.notHavePermissions',
      'Must have permissions to archive a type of board.');
    }

    BoardTypes.update(boardTypeId, {
      $set: {
        archived: true,
      },
    });
  },
});

/**
 * Dearchives a type of board
 *
 * @type {ValidatedMethod}
 * @param {String} boardTypeId
 */
export const dearchiveBoardType = new ValidatedMethod({
  name: 'BoardTypes.methods.dearchive',
  validate: new SimpleSchema({
    boardTypeId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ boardTypeId }) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('BoardTypes.methods.dearchive.notLoggedIn',
      'Must be logged in to dearchive a type of board.');
    }

    const boardType = BoardTypes.findOne(boardTypeId);
    const teamId = boardType.teamId;
    const key = 'create_and_archive_board_type';

    if (!user.hasPermission({ teamId, key })) {
      throw new Meteor.Error('BoardTypes.methods.dearchive.notHavePermissions',
      'Must have permissions to dearchive a type of board.');
    }

    BoardTypes.update(boardTypeId, {
      $set: {
        archived: false,
      },
    });
  },
});
