import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

let globalModuleInstanceId, userId, boards, sub;

let printObject = (obj) => {
  console.log(JSON.stringify(obj, function(key, val) {
    return (typeof val === 'function' ? val + '' : val);
  }, 4));
};

Meteor.publish('moduleInstances.data', function(moduleInstanceId, obj) {
  let teamId = ModuleInstances.findOne(moduleInstanceId).board().team()._id;
  boards = Meteor.user().boards(teamId, { _id: 1 }).map((board) => board._id);

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
