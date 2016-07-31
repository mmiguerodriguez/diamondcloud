import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

Meteor.publish('ModuleInstances.database', function(collection, condition) {
  
  return ModuleInstances.aggregate(
    [
      {
        $project: {
          [collection]: `$database.${collection}`
        }
      },
      {
        $project: {
          [collection]: {
            $filter: {
              input: `$${collection}`,
              as: 'element',
              cond: condition
            }
          }
        }
      },
      {
        $match: {
          $or: [
            { 'todos.visibleBy': null },
            { 'todos.visibleBy.userId': this.userId },
            { 'todos.visibleBy.boardId': { $in: ['General', '.'] } },
            { 'todos.visibleBy.groupId': { $in: ['sas','.'] } }
          ]
        }
      }
    ]
  )._batch;
});
