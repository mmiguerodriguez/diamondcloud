import { Meteor }           from 'meteor/meteor';

import { printObject }          from '../../helpers/print-objects.js';

import { ModuleInstances }  from '../../module-instances/module-instances.js';
import { ModuleData }       from '../../module-data/module-data.js';
import { Boards }           from '../../boards/boards.js';

Meteor.publish('moduleData.data', function(moduleInstanceId, obj) {
  let moduleInstance = ModuleInstances.findOne(moduleInstanceId);
  if (moduleInstance === undefined || moduleInstance === null) {
    throw new Meteor.Error('ModuleData.data.notAValidModuleInstance',
    'Must call from existing module instance.');
  }
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
  
  // Get the correct moduleData
  let pipeline = [
    {
      $match: {
        _id: moduleData._id,
      }
    },
  ];

  if (obj.condition) {
    // Filter by consumer condition
    pipeline.push(
      {
        $project: {
          teamId: 1,
          moduleId: 1,
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
  
  // Filter the data that should be private for that moduleInstance
  pipeline.push(
    {
      $project: {
        teamId: 1,
        moduleId: 1,
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
  let keys = {};
  let condOptions = [];

  ModuleData.aggregate(pipeline, (err, res) => {
    if (res[0].data[obj.collection] !== null) {
      res[0].data[obj.collection].forEach((doc) => {
        for (let i in doc) {
          console.log(i);
          keys[`data.${obj.collection}.${i}`] = 1;
        }
        if (doc.visibleBy === undefined) {
          ids.push(doc._id);
        } else {
          doc.visibleBy.forEach((visObj) => {
            if (visObj.userId == this.userId) {
              ids.push(doc._id);
            }
            boards.forEach((boardId) => {
              if (boardId == visObj.boardId) ids.push(doc._id);
            });
          });
        }
      });
    }

    ids.forEach((id) => {
      condOptions.push({
        $eq: ['$$element._id', id]
      });
    });

    pipeline.push(
      {
        $project: {
          teamId: 1,
          moduleId: 1,
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

    delete keys[`data.${obj.collection}.moduleInstanceId`];
    delete keys[`data.${obj.collection}.isGlobal`];
    keys.teamId = 1;
    keys.moduleId = 1;

    if (Object.keys(keys).length > 0) {
      pipeline.push(
        {
          $project: keys
        }
      );
    }
    
    printObject('Pipeline:', pipeline);

    ReactiveAggregate(this, ModuleData, pipeline);
  });
});
