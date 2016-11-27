import { Mongo }        from 'meteor/mongo';

import { Modules }      from '../modules/modules';
import readModuleConfig from '../helpers/read-module-config';

export const Permissions = new Mongo.Collection('Permissions');

Permissions.helpers({});
Permissions.findByKey = key => Permissions.findOne({ key });

Modules.find().fetch().forEach((module) => {
  readModuleConfig(module._id)
  .then((result) => {
    const { settings } = result;

    settings.permissions.forEach((permission) => {
      if (!Permissions.findByKey(permission.key)) {
        Permissions.insert(permission);
      }
    });

    settings.boardTypeProps.forEach((property) => {
    //  BoardTypeProps.insert(property);
    });
  }, (error) => {
    if (error.code === 'ENOENT') {
      console.log(`${module.name} config.json file wasn't found`);
    }
  });
});

/**
 * Permissions
 * - access_all_boards
 * - access_visible_boards
 * - share_team
 * - change_user_hierarchy
 * - remove_user_from_team
 */
const permissions = [
  {
    name: 'Acceder a todos los pizarrones',
    description: 'Permite al usuario a acceder a cualquier pizarrón',
    key: 'access_all_boards',
  },
  {
    name: 'Acceder a los pizarrones visibles',
    description: 'Permite al usuario a acceder a todos los pizarrones visibles',
    key: 'access_visible_boards',
  },
  {
    name: 'Compartir equipo',
    description: 'Permite al usuario a compartir el equipo',
    key: 'share_team',
  },
  {
    name: 'Cambiar jerarquía',
    description: 'Permite al usuario cambiar la jerarquía de otros',
    key: 'change_user_hierarchy',
  },
  {
    name: 'Eliminar usuario',
    description: 'Permite al usuario a eliminar a otro',
    key: 'remove_user_from_team',
  },
];

if (Permissions.find().count() < permissions.length) {
  permissions.forEach((permission) => {
    if (!Permissions.findByKey(permission.key)) {
      Permissions.insert(permission);
    }
  });
}
