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
  let keys = [
    `${key}.visibleBy`,
    `${key}.visibleBy.userId`,
    `${key}.visibleBy.boardId`,
    `${key}.isGlobal`,
    `${key}.moduleInstanceId`,
  ];

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
        $and: [
          {
            $or: [
              { [keys[0]]: null },
              { [keys[1]]: this.userId },
              { [keys[2]]: { $in: boards } }
            ],
          },
          {
            $or: [
              { [keys[3]]: true },
              { [keys[4]]: moduleInstance._id }
            ]
          },
        ]
      }
    }
  );

  ReactiveAggregate(this, ModuleData, pipeline);
});
