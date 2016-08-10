import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

Meteor.publish('moduleInstances.data', function(moduleInstanceId, obj) {

  let teamId = ModuleInstances.findOne(moduleInstanceId).board().team()._id;

  let boards = Meteor.user().boards(teamId, { _id: 1 });
  boards = boards.map((board) => {
    return board._id;
  });

  let generateTree = (params, upperParams) => {
    let children = [];
    if (params.children) {
      console.log('Has childrens!');
      params.children.forEach((child) => children.push(generateTree(child, params)));
    }
    let result = {
      find: () => {
        return ModuleInstances.aggregate(
          [
            {
              $match: {
                '$_id': moduleInstanceId,
              }
            },
            {
              $project: {
                [params.collection]: `$data.${params.collection}`
              }
            },
            {
              $project: {
                [params.collection]: {
                  $filter: {
                    input: `$${params.collection}`,
                    as: 'element',
                    cond: params.condition
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
      }
    };
    
    if (children.length) result.children = children;
  };
  
  return generateTree(obj);
});
