import { Meteor }          from 'meteor/meteor';
import { resetDatabase }   from 'meteor/xolvio:cleaner';
import { sinon }           from 'meteor/practicalmeteor:sinon';
import { chai }            from 'meteor/practicalmeteor:chai';

import { insertFirstUser } from './methods.js';
import { Teams }           from '../teams/teams.js';

import '../factories/factories.js';

if (Meteor.isServer) {
  describe('Accounts', () => {
    describe('Methods', () => {
      let user, team;

      beforeEach(() => {
        resetDatabase();

        user = Factory.create('user');
        team = Factory.create('team', { users: [] });

        resetDatabase();

        Meteor.users.insert(user);
        Teams.insert(team);

        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(() => {
        Meteor.user.restore();
      });

      it('should insert the first user of a team on login', (done) => {
        insertFirstUser.call({ url: team.url }, (error, result) => {
          if (error) {
            throw new Meteor.Error(error);
          } else {
            let _team = Teams.findOne({ _id: team._id });

            chai.assert.equal(_team.users.length, 1);
            chai.assert.deepEqual(_team.users, [{ email: user.emails[0].address, hierarchy: 'sistemas' }]);

            done();
          }
        });
      });
    });
  });
}
