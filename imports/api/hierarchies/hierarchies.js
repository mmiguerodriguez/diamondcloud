import { Mongo }       from 'meteor/mongo';

import { Team }        from '../teams/teams';
import { Permissions } from '../permissions/permissions';

export let Hierarchies = new Mongo.Collection('Hierarchies');

Hierarchies.helpers({
  team(fields = {}) {
    return Team.findOne({
      _id: this.teamId,
    }, { fields });
  },
  /**
   * hasPermission: returns if the hierarchy has certain permission
   *
   * @param {String} permissionId
   *  The permission id.
   * @param {String} key (optional)
   *  The permission key
   * @returns {Boolean} hasPermission
   *  True if the hierarchy of the user in the team has the  permission
   *  False otherwise
   */
  hasPermission({ permissionId, key }) {
    if (key) {
      const permission = Permissions.findByKey(key);
      if (!permission) {
        throw new Meteor.Error('Hierarchies.helpers.hasPermission.wrongKey',
        'The key passed is not valid.');
      }

      permissionId = permission._id;
    }

    let hasPermission = false;
    // Loop over all the elements in the permissions array
    // and while the permission has not been found already
    for (let i = 0; i < this.permissions.length && !hasPermission; i++) {
      if (this.permissions[i]._id === permissionId) {
        hasPermission = true;
      }
    }

    return hasPermission;
  }
});
