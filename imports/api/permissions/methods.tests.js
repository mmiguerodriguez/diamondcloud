import { Meteor }           from 'meteor/meteor';
import { resetDatabase }    from 'meteor/xolvio:cleaner';
import { sinon }            from 'meteor/practicalmeteor:sinon';
import { chai, assert }     from 'meteor/practicalmeteor:chai';

import { Permissions }      from './permissions';
import { createPermission } from './methods';

import '../factories/factories';

if (Meteor.isServer) {
  describe('Permissions', () => {
    describe('Methods', () => {
      let user;
      let permission;

      beforeEach(() => {
        resetDatabase();

        user = Factory.create('user');
        permission = Factory.create('permission');

        resetDatabase();

        Meteor.users.insert(user);

        sinon.stub(Meteor, 'user', () => user);
      });

      afterEach(() => {
        Meteor.user.restore();
      });

      it('should create a permission', (done) => {
        let args = {
          key: permission.key,
          name: permission.name,
        };

        console.log('args',args);

        createPermission.call(args, (error, result) => {
          console.log(permission, _permission, error, result);
          if (error) {
            throw new Meteor.Error(error);
          }

          const _permission = Permissions.findOne();
          delete _permission._id;

          assert.deepEqual(permission, _permission);
          assert.equal(1, Permissions.find().length);

          done();
        });
      });
    });
  });
}
