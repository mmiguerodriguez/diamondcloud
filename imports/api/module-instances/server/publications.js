import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

Meteor.publish('ModuleInstances.database', function(obj, teamId) {

  let boards = this.user.boards(teamId, { _id: 1 });
  boards = boards.map((board) => {
    return board._id;
  });

  let groups = this.user.groups(teamId, { _id: 1});
  groups = groups.map((group) => {
    return group._id;
  });

  let generateTree = (params, upperParams) => {
    let children = [];
    params.children.forEach((child) => {
      children.push(generateTree(child, params));
    });
    let result = {
      find: () => {
        return ModuleInstances.aggregate(
          [
            {
              $project: {
                [params.collection]: `$database.${params.collection}`
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
                  { 'todos.visibleBy.boardId': { $in: boards } },
                  { 'todos.visibleBy.groupId': { $in: groups } }
                ]
              }
            }
          ]
        );
      },
      children
    };
  };

  return generateTree(obj);
});
