import { Teams }       from '../teams/teams';
import { Boards }      from '../boards/boards';
import { Hierarchies } from '../hierarchies/hierarchies';
import { Permissions } from '../permissions/permissions';

Meteor.users.helpers({
  teams({ fields }) {
    fields = fields || {};

    let teams = Teams.find({
      users: {
        $elemMatch: {
          email: this.emails[0].address,
        }
      },
      archived: false,
    }, {
      fields,
    });

    if (teams)
      return teams;
  },
  boards(teamId, fields) {
    fields = fields || {};
    let team = Teams.findOne(teamId);
    if (!team) {
      throw new Meteor.Error('Users.boards.wrongTeamId',
      'There is no team with the given id');
    }
    if (!team.hasUser({ _id: this._id })) {
      throw new Meteor.Error('Users.boards.userNotInTeam',
      'The user is not in the team');
    }
    return Boards.getBoards(team.boards, this._id);
  },
  email() {
    return this.emails[0].address;
  },
  /**
   * Returns the  hierarchy of the current user in a given team
   *
   * @param {String} teamId
   * @returns {Object} hierarchy
   */
  hierarchy(teamId) {
    if (!teamId) {
      throw new Meteor.Error('Meteor.users.helpers.hierarchy.parameterMissing',
      'There is a missing parameter.');
    }
    const team = Teams.findOne(teamId);
    const hierarchyId = team.users.find((user) => 
      user.email === this.email()
    ).hierarchy;
    return Hierarchies.findOne(hierarchyId);
  },
  /**
   * Returns if the  current user has a certain permission
   *
   * @param {String} permissionId
   *  The permission id.
   * @param {String} key
   *  The permission key
   * @returns {Boolean} hasPermission
   *  True if the hierarchy of the user in the team has the  permission
   *  False otherwise
   */
  hasPermission({ teamId, permissionId, key }) {
    if (!teamId) {
      throw new Meteor.Error('Meteor.users.helpers.hasPermission.parameterMissing',
      'There is a missing parameter.');
    }
    if (key) {
      const permission = Permissions.findByKey(key);
      if (!permission) {
        throw new Meteor.Error('Hierarchies.helpers.hasPermission.wrongKey',
        'The key passed is not valid.');
      }

      permissionId = permission._id;
    }
    
    return this.hierarchy().hasPermission({ id: permissionId });
  },
});

Meteor.users.dashboardFields = {
  profile: 1,
  emails: 1,
};

Meteor.users.findByEmail = (emails, fields) => {
  if (typeof emails === 'string') {
    return Meteor.users.findOne({ 'emails.address': emails }, { fields });
  }

  return Meteor.users.find({
    'emails.address': {
      $in: emails,
    },
  }, { fields });
};

Meteor.users.deny({
  update() { return true; }
});
