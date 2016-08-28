import { Meteor } from 'meteor/meteor';

import { ModuleInstances } from '../module-instances.js';
import { Boards } from '../../boards/boards.js';

let globalModuleInstanceId, userId, boards, sub;

Meteor.publish('moduleInstances.data', function(moduleInstanceId, obj) {
  let board = ModuleInstances.findOne(moduleInstanceId).board();
  let teamId = board.team()._id;
  boards = Meteor.user().boards(teamId, { _id: 1 }).map((board) => board._id);
  
  if (!Boards.isValid(board._id, this.userId)) {
    throw new Meteor.Error('ModuleInstances.data.notAValidMember',
    'Must be a valid member.');
  }
  
  let pipeline = [
    {
      $match: {
        '_id': moduleInstanceId,
      }
    },
    {
      $project: {
         [obj.collection]: `$data.${obj.collection}`,
      }
    },

  ];

  if (obj.condition) pipeline.push(
    {
      $project: {
        [obj.collection]: {
          $filter: {
            input: `$${obj.collection}`,
            as: 'element',
            cond: obj.condition
          }
        }
      }
    }
  );

  pipeline.push(
    {
      $match: {
        $or: [
          { 'todos.visibleBy': null },
          { 'todos.visibleBy.userId': this.userId },
          { 'todos.visibleBy.boardId': { $in: boards } }
        ]
      }
    }
  );

  ReactiveAggregate(this, ModuleInstances, pipeline);
});
