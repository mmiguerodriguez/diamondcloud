import { Meteor }           from 'meteor/meteor';

import { printObject }          from '../../helpers/print-objects.js';

import { ModuleInstances }  from '../../module-instances/module-instances.js';
import { ModuleData }       from '../../module-data/module-data.js';
import { Boards }           from '../../boards/boards.js';

Meteor.publish('moduleData.data', function(moduleInstanceId, obj) {
  let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
  let board = moduleInstance.board();
  let teamId = board.team()._id;
  let moduleData = ModuleData.findOne({
    moduleId: moduleInstance.moduleId,
    teamId,
  });
  let boards = Meteor.users.findOne(this.userId)
  .boards(teamId, { _id: 1 }).map((board) => board._id);

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
                  $eq: ['$$element.isGlobal', true]
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

  let ids = [];
  let condOptions = [];

  ModuleData.aggregate(pipeline, (err, res) => {
    res[0].data[obj.collection].forEach((doc) => {
      if (doc.visibleBy === undefined) {
        ids.push(doc._id);
      } else {
        doc.visibleBy.forEach((visObj) => {
          if (visObj.userId == this.userId) ids.push(doc._id);
          boards.forEach((boardId) => {
            if (boardId == visObj.boardId) ids.push(doc._id);
          });
        });
      }
    });

    ids.forEach((id) => {
      condOptions.push({
        $eq: ['$$element._id', id]
      });
    });

    pipeline.push(
      {
        $project: {
          [`data.${obj.collection}`]: {
            $filter: {
              input: `$data.${obj.collection}`,
              as: 'element',
              cond: {
                $or: condOptions
              },
            }
          },
        }
      }
    );

    ReactiveAggregate(this, ModuleData, pipeline);
  });
});
