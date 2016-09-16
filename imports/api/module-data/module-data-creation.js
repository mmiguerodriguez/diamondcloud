import { Mongo }                   from 'meteor/mongo';

import { ModuleData }              from './module-data.js';
import { Modules, createdModules } from '../modules/modules.js';
import { Teams }                   from '../teams/teams.js';

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
          data: {},
        });
      } else if (moduleData.data === undefined) {
        ModuleData.update(module._id, {
          teamId: team._id,
          moduleId: module._id,
          data: {},
        });
      }
    });
  });
};

createModuleData();
