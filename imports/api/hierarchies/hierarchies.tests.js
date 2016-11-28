import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory }       from 'meteor/dburles:factory';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai, assert }  from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';

import { Hierarchies }   from './hierarchies';
import { Permissions }   from '../permissions/permissions';

if (Meteor.isServer) {
  describe('Hierarchies', () => {
    describe('Helpers', () => {
      describe('hasPermission', () => {
        let hierarchy;
        let permissions;
  
        before(() => {
          resetDatabase();
          permissions = [
            { _id: Random.id() },
          ];
  
          hierarchy = Factory.create('hierarchy', { permissions });
          
          sinon.stub(Permissions, 'findByKey', () => permissions[0]);
        });
        
        after(() => {
          Permissions.findByKey.restore();
        });
        
        it('should return true if a hierarchy has a permission', () => {
          const hasPermission = hierarchy.hasPermission({
            permissionId: permissions[0]._id,
          });
          
          assert.isTrue(hasPermission);
        });
        
        it(`should return false if a hierarchy
            does not have a permission`, () => {
          
          const hasPermission = hierarchy.hasPermission({
            permissionId: Random.id(),
          });
          
          assert.isFalse(hasPermission);
        });
        
        it('should return true if a hierarchy has a permission by key', () => {
          /**
           * Permissions.findByKey is stubbed so it
           * will always return true
           */
          const hasPermission = hierarchy.hasPermission({
            key: Random.id(),
          });
          
          assert.isTrue(hasPermission);
        });
      });
    });
  });
}
