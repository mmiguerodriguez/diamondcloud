import { Mongo }                   from 'meteor/mongo';

import { Modules, createdModules } from '../modules/modules.js';
import { Teams }                   from '../teams/teams.js';

export let ModuleData = new Mongo.Collection('ModuleData');

export let createModuleData = () => {
  createdModules.forEach((module) => {
    if (Modules.findOne(module._id) === undefined) Modules.insert(module);
    Teams.find().fetch().forEach((team) => {
      let moduleData = ModuleData.findOne({
        teamId: team._id,
        moduleId: module._id,
      });
      if (moduleData === undefined) {
        ModuleData.insert({
          teamId: team._id,
          moduleId: module._id,
        });
      }
    });
  });
};

createModuleData();
