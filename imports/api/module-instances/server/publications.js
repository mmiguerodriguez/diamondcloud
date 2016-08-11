"use strict";
import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

Meteor.publishComposite('moduleInstances.data', function(moduleInstanceId, obj) {
  let teamId = ModuleInstances.findOne(moduleInstanceId).board().team()._id;
  let boards = Meteor.user().boards(teamId, { _id: 1 });
  boards = boards.map((board) => board._id);
  let generateTree = (params) => {
    "use strict";
    let children = [];
    if (params.children) params.children.forEach((child) => children.push(generateTree(child)));
    let functionBody = `
      "use strict";
      import { ModuleInstances } from '../module-instances.js';
      let parentDocuments = arguments;
      return ModuleInstances.aggregate(
        [
          {
            $match: {
              '_id': moduleInstanceId,
            }
          },
          {
            $project: {
              ${params.collection}: '$data.${params.collection}',
            }
          },
          {
            $project: {
              ${params.collection}: {
                $filter: {
                  input: '$${params.collection}',
                  as: 'element',
                  cond: ${params.condition}
                }
              }
            }
          },
          {
            $match: {
              $or: [
                { 'todos.visibleBy': null },
                { 'todos.visibleBy.userId': this.userId },
                { 'todos.visibleBy.boardId': { $in: boards } }
              ]
            }
          }
        ]
      );
    `;
    var result = {};
    /* jshint ignore:start */
    result.find = new Function(functionBody);
    /* jshint ignore:end */
    if (children.length) result.children = children;
    return result;
  };
  let x = generateTree(obj);
  console.log(JSON.stringify(x, function(key, val) {
    if (typeof val === 'function') {
      return val + ''; // implicitly `toString` it
    }
    return val;
  }, 4));
  return x;
});
