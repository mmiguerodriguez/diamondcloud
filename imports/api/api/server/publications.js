import { Meteor }           from 'meteor/meteor';

import { ModuleInstances }  from '../../module-instances/module-instances';
import { APICollection }    from '../../api-collection/api-collection';
import { Boards }           from '../../boards/boards';

Meteor.publish('APICollection.data', function (moduleInstanceId, collection, filter) {
  if (!this.userId) {
    this.stop();
    throw new Meteor.Error('APICollection.data.notLoggedIn',
    'Must be logged in to view module data.');
  }

  const moduleInstance = ModuleInstances.findOne(moduleInstanceId);

  if (moduleInstance === undefined || moduleInstance === null) {
    this.stop();
    throw new Meteor.Error('APICollection.data.notAValidModuleInstance',
    'Must call from existing module instance.');
  }

  if (moduleInstance.archived) {
    this.stop();
    throw new Meteor.Error('APICollection.data.archivedModuleInstance',
    'Can\'t subscribe to archived module instance.');
  }

  const board = moduleInstance.board();
  const teamId = board.team()._id;

  if (!Boards.isValid(board._id, this.userId)) {
    this.stop();
    throw new Meteor.Error('APICollection.data.notAValidMember',
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
          },
        ],
      },
    ],
  });
});
