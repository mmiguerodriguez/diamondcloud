import { Mongo }                   from 'meteor/mongo';

import { Modules, createdModules } from '../modules/modules.js';
import { Teams }                   from '../teams/teams.js';

export let ModuleData = new Mongo.Collection('ModuleData');
