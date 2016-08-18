import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

let globalModuleInstanceId, userId, boards, sub;

let printObject = (obj) => {
  console.log(JSON.stringify(obj, function(key, val) {
    return (typeof val === 'function' ? val + '' : val);
  }, 4));
};

let generateTree = (params) => {
  let children = [];
  if (params.children) {
    params.children.forEach((child) => {
      children.push(generateTree(child));
    });
  }
  let find = function() {
    let parents = arguments;
    let pipeline = [
      {
        $match: {
          '_id': globalModuleInstanceId,
        }
      },
      {
        $project: {
           [params.collection]: `$data.${params.collection}`,
        }
      },

    ];
    if (params.condition) pipeline.push(
      {
        $project: {
          [params.collection]: {
            $filter: {
              input: `$${params.collection}`,
              as: 'element',
              cond: JSON.parse(params.condition)
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
            { 'todos.visibleBy.userId': userId },
            { 'todos.visibleBy.boardId': { $in: boards } }
          ]
        }
      }
    );
    ModuleInstances.aggregate(pipeline);
    // Return find del coso
  };
  let result = {
    find
  };
  if (children.length) result.children = children;
  return result;
};

Meteor.publishComposite('moduleInstances.data', function(moduleInstanceId, obj) {
  sub = this;
  let teamId = ModuleInstances.findOne(moduleInstanceId).board().team()._id;
  boards = Meteor.user().boards(teamId, { _id: 1 }).map((board) => board._id);
  globalModuleInstanceId = moduleInstanceId;
  userId = this.userId;
  let x = generateTree(obj);
  //printObject(x);
  return x;
});
