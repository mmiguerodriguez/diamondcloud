import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import Future              from 'fibers/future';

import { Boards }          from './boards';
import { Teams }           from '../teams/teams';
import { ModuleInstances } from '../module-instances/module-instances';

/**
 * Creates a board
 * If the board is private, it pushes as users the
 * parameter users, but when it isn't, it pushes
 * the team users.
 *
 * @type {ValidatedMethod}
 * @param {String} teamId
 * @param {String} name
 * @param {String} type
 * @param {Boolean} isPrivate
 * @param {Object} users (optional)
 *   @param {String} email (optional)
 * @param {Boolean} visibleForDirectors (optional)
 * @returns {Object} board
 *   The created board
 */
export const createBoard = new ValidatedMethod({
  name: 'Boards.methods.create',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, min: 0, max: 200 },
    type: {
      type: String,
      allowedValues: [
        'default',
        'creativos',
        'sistemas',
        'directores creativos',
        'directores de cuentas',
        'administradores',
        'coordinadores',
        'medios',
      ],
    },
    isPrivate: { type: Boolean },
    users: { type: [Object], optional: true },
    'users.$.email': { type: String, regEx: SimpleSchema.RegEx.Email, optional: true },
    visibleForDirectors: { type: Boolean, optional: true },
  }).validator(),
  run({ teamId, name, type, isPrivate, users, visibleForDirectors }) {
    if (name !== 'General' && type !== 'default') {
      if (!Meteor.user()) {
        throw new Meteor.Error('Boards.methods.createBoard.notLoggedIn',
        'Must be logged in to create a board.');
      }
    }

    const team = Teams.findOne(teamId);
    users = users || [];
    visibleForDirectors = !!visibleForDirectors;

    if (isPrivate) {
      users.forEach((user, index, array) => {
        if (!team.hasUser({ email: user.email })) {
          throw new Meteor.Error('Boards.methods.createBoard.userNotInTeam',
          'You cannot add people to a board that are not part of the team.');
        }

        array[index].notifications = 0;
      });
    } else {
      users = [];

      team.users.forEach((user) => {
        users.push({ email: user.email, notifications: 0 });
      });
    }

    const board = {
      name,
      users,
      type,
      isPrivate,
      moduleInstances: [],
      archived: false,
      visibleForDirectors,
    };

    const future = new Future();
    Boards.insert(board, (error, result) => {
      if (error) {
        future.throw(error);
      }

      const boardId = result;
      const _board = Boards.findOne(boardId);

      Teams.update(teamId, {
        $push: {
          boards: {
            _id: boardId,
          },
        },
      });

      /**
       * Inserts certain moduleInstances for each type
       * of board.
       */
      let moduleInstances;
      if (board.type === 'creativos') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
          { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
          { moduleId: 'videocall', x: 50, y: 772, width: 270, height: 290, archived: false, minimized: false },
        ];
      } else if (board.type === 'coordinadores') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
        ];
      } else if (board.type === 'directores creativos' || board.type === 'directores de cuentas' || board.type === 'administradores' ||  board.type === 'medios') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 312, height: 400, archived: false, minimized: false },
          { moduleId: 'drive', x: 50, y: 352, width: 400, height: 400, archived: false, minimized: false },
        ];
      }

      if (moduleInstances) {
        ModuleInstances.insertManyInstances(moduleInstances, boardId, (error, result) => {
          if (error) {
            throw new Meteor.Error(error);
          } else {
            future.return(_board);
          }
        });
      }

      future.return(_board);
    });
    return future.wait();
  },
});
/**
 * Edits a board information
 *
 * @type {ValidatedMethod}
 * @param {String} boardId
 * @param {String} name (optional)
 * @param {String} type (optional)
 * @param {Boolean} isPrivate (optional)
 * @param {Object} users (optional)
 * @returns {Object} board
 *  The updated board
 */
export const editBoard = new ValidatedMethod({
  name: 'Boards.methods.editBoard',
  validate: new SimpleSchema({
    boardId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, optional: true },
    type: {
      type: String,
      allowedValues: [
        'default',
        'creativos',
        'sistemas',
        'directores creativos',
        'directores de cuentas',
        'administradores',
        'coordinadores',
        'medios',
      ],
      optional: true,
    },
    isPrivate: { type: Boolean, optional: true },
    users: { type: [Object], optional: true },
    'users.$.email': {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      optional: true,
    },
  }).validator(),
  run({ boardId, name, type, isPrivate, users }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.editBoard.notLoggedIn',
      'Must be logged in to edit a board.');
    }

    let board = Boards.findOne(boardId);
    const team = board.team();

    name = name || board.name;
    type = type || board.type;

    if (!isPrivate) {
      users = [];
      team.users.forEach((user) => {
        let found = false;
        board.users.forEach((_user) => {
          if (_user.email === user.email) {
            users.push({ email: user.email, notifications: _user.notifications });
            found = true;
          }
        });

        if (!found) {
          users.push({ email: user.email, notifications: 0 });
        }
      });
    } else if ((!board.isPrivate && isPrivate) || (board.isPrivate && isPrivate)) {
      users.forEach((user, index) => {
        if (!team.hasUser({ email: user.email })) {
          throw new Meteor.Error('Boards.methods.createBoard.userNotInTeam',
          'You cannot add people to a board that are not part of the team.');
        }

        let found = false;
        board.users.forEach((_user) => {
          if (_user.email === user.email) {
            users[index].notifications = _user.notifications;
            found = true;
          }
        });

        if (!found) {
          users[index].notifications = 0;
        }
      });
    }

    Boards.update(boardId, {
      $set: {
        name,
        type,
        isPrivate,
        users,
      },
    });

    board = Boards.findOne(boardId);
    return board;
  },
});
/**
 * Archives a board
 *
 * @type {ValidatedMethod}
 * @param {String} _id
 * @returns {Object} board
 *  The updated board
 */
export const archiveBoard = new ValidatedMethod({
  name: 'Boards.methods.archiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.archiveBoard.notLoggedIn',
      'Must be logged in to archive a board.');
    }

    Boards.update(_id, {
      $set: {
        archived: true,
      },
    });

    return Boards.findOne(_id);
  },
});
/**
 * Dearchives a board
 *
 * @type {ValidatedMethod}
 * @param {String} _id
 * @returns {Object} board
 *  The updated board
 */
export const dearchiveBoard = new ValidatedMethod({
  name: 'Boards.methods.dearchiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.dearchiveBoard.notLoggedIn',
      'Must be logged in to dearchive a board.');
    }

    Boards.update(_id, {
      $set: {
        archived: false,
      },
    });

    return Boards.findOne(_id);
  },
});
 /**
  * Unlocks the board and makes it visible for
  * directors
  *
  * @type {ValidatedMethod}
  * @param {String} _id
  * @returns {Object} board
  *  The updated board
  */
export const unlockBoard = new ValidatedMethod({
  name: 'Boards.methods.unlockBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.unlockBoard.notLoggedIn',
      'Must be logged in to unlock a board.');
    }

    Boards.update(_id, {
      $set: {
        visibleForDirectors: true,
      },
    });

    return Boards.findOne(_id);
  },
});
/**
 * Unlocks the board and makes it
 * invisible for directors
 *
 * @type {ValidatedMethod}
 * @param {String} _id
 * @returns {Object} board
 *  The updated board
 */
export const lockBoard = new ValidatedMethod({
  name: 'Boards.methods.lockBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.lockBoard.notLoggedIn',
      'Must be logged in to lock a board.');
    }

    Boards.update(_id, {
      $set: {
        visibleForDirectors: false,
      },
    });

    return Boards.findOne(_id);
  },
});
