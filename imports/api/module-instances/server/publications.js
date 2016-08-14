import { Meteor } from 'meteor/meteor';
import { ModuleInstances } from '../module-instances.js';

let miid;

let printObject = (obj) => {
  console.log(obj, function(key, val) {
    if (typeof val === 'function') return val + '';
    return val;
  }, 4);
};

let generateTree = (params) => {
  let children = [];
  if (params.children) {
    params.children.forEach((child) => {
      children.push(generateTree(child));
    });
  }
  let functionBody = `
    "use strict";
    return ModuleInstances.aggregate(
      [
        {
          $match: {
            '_id': '${miid}',
          }
        },/*
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
        }*/
      ]
    );
  `;
  /* jshint ignore:start */
  let findFunc = new Function('ModuleInstances', 'parents', functionBody);
  /* jshint ignore:end */
  let find = function find() {
    let parents = arguments;
    return findFunc(ModuleInstances, parents);
  };
  var result = {
    find
  };
  if (children.length) result.children = children;
  return result;
};

Meteor.publishComposite('moduleInstances.data', function(moduleInstanceId, obj) {
  let teamId = ModuleInstances.findOne(moduleInstanceId).board().team()._id;
  let boards = Meteor.user().boards(teamId, { _id: 1 }).map((board) => board._id);
  miid = moduleInstanceId;
  let x = generateTree(obj);
  printObject(x);
  return x;
});
