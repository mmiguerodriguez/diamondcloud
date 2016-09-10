import { Meteor }           from 'meteor/meteor';

import { printObject }          from '../../helpers/print-objects.js';

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

  if (obj.condition) {
    pipeline.push(
      {
        $project: {
          [`data.${obj.collection}`]: {
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
      $project: {
        [`data.${obj.collection}`]: {
          $filter: {
            input: `$data.${obj.collection}`,
            as: 'element',
            cond: {
              $or: [
                {
                  $eq: ['$$element.visibleBy', null],
                },
                {
                  $eq: ['$$element.visibleBy', undefined],
                },
                {
                  $eq: ['$$element.visibleBy.userId', this.userId],
                },
                /*
                {
                  ['$$element.boardId']: {
                    $in: boards
                  }
                }
                */
              ]
            },
          }
        },
      }
    }
  );

  if (obj.condition) {
    pipeline.push(
      {
        $project: {
          [`data.${obj.collection}`]: {
            $filter: {
              input: `$data.${obj.collection}`,
              as: 'element',
              cond: {
                $or: [
                  {
                    $eq: ['$$element.visibleBy.isGlobal', true]
                  },
                  {
                    $eq: ['$$element.moduleInstanceId', moduleInstance._id ]
                  }
                ]
              },
            }
          }
        }
      }
    );
  }

  ReactiveAggregate(this, ModuleData, pipeline);
});
