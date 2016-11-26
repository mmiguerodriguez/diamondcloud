import { Meteor }           from 'meteor/meteor';
import { Factory }          from 'meteor/dburles:factory';
import { resetDatabase }    from 'meteor/xolvio:cleaner';
import { sinon }            from 'meteor/practicalmeteor:sinon';
import { assert }           from 'meteor/practicalmeteor:chai';
import faker                from 'faker';

import { Permissions }      from './permissions';
import { createPermission } from './methods';

if (Meteor.isServer) {
  describe('Permissions', () => {
    describe('Methods', () => {
      let user;

      before(() => {
        resetDatabase();

        user = Factory.create('user');

        sinon.stub(Meteor, 'user', () => user);
      });

      after(() => {
        Meteor.user.restore();
      });

      it('should create a permission', (done) => {
        const permission = {
          key: faker.lorem.word(),
          name: faker.lorem.word(),
        };

        createPermission.call(permission, (error, result) => {
          if (error) {
            throw new Meteor.Error(error);
          }

          const _permission = Permissions.findOne();
          delete _permission._id;

          assert.deepEqual(permission, _permission);
          assert.equal(1, Permissions.find().count());

          done();
        });
      });
      
      it('should not create a permission if it already exists', (done) => {
        const _permission = Factory.create('permission');
        const permission = {
          key: _permission.key,
          name: _permission.name,
        };
        
        createPermission.call(permission, (error, result) => {
          assert.isNotNull(error);
          done();
        });
      });
    });
  });
}
