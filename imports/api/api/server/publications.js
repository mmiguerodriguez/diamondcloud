import { Meteor }           from 'meteor/meteor';

import { ModuleInstances }  from '../../module-instances/module-instances.js';
import { ModuleData }       from '../../module-data/module-data.js';
import { Boards }           from '../../boards/boards.js';

Meteor.publish('moduleData.data', function(moduleInstanceId, obj) {
  let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
  let board = moduleInstance.board();
  let teamId = board.team()._id;
  let boards = Meteor.users
               .findOne(this.userId)
               .boards(teamId, { _id: 1 })
               .map((board) => board._id);
  let moduleData = ModuleData.findOne({
    moduleId: moduleInstance.moduleId,
    teamId,
  });

  if (!Boards.isValid(board._id, this.userId)) {
    throw new Meteor.Error('ModuleData.data.notAValidMember',
    'Must be a valid member.');
  }

  let pipeline = [
    {
      $match: {
        _id: moduleData._id,
      }
    },
  ];

  let key = `data.${obj.collection}`;

  if (obj.condition) {
    pipeline.push(
      {
        $project: {
          [key]: {
            $filter: {
              input: `$data.${obj.collection}`,
              as: 'element',
              cond: obj.condition,
            }
          }
        }
      }
    );
  }

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

  ReactiveAggregate(this, ModuleData, pipeline);
});
