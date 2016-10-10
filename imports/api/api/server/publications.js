import { Meteor }           from 'meteor/meteor';

import { printObject }          from '../../helpers/print-objects.js';

import { ModuleInstances }  from '../../module-instances/module-instances.js';
import { APICollection }       from '../../api-collection/api-collection.js';
import { Boards }           from '../../boards/boards.js';

Meteor.publish('APICollection.data', function(moduleInstanceId, collection, filter) {
  let moduleInstance = ModuleInstances.findOne(moduleInstanceId);

  if (moduleInstance === undefined || moduleInstance === null) {
    throw new Meteor.Error('ModuleData.data.notAValidModuleInstance',
    'Must call from existing module instance.');
  }

  let board = moduleInstance.board();
  let teamId = board.team()._id;

  if (!Boards.isValid(board._id, this.userId)) {
    throw new Meteor.Error('ModuleData.data.notAValidMember',
    'Must be a valid member.');
  }

  return APICollection.find({
    $and: [
      {
        '#collection': collection,
      },
      filter,
      {
        $or: [
          {
            '#moduleInstanceId': moduleInstanceId,
          },
          {
            '#moduleId': moduleInstance.moduleId,
            '#teamId': teamId,
          }
        ]
      }
    ],
  });

});
