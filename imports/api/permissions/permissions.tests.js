import { Meteor }      from 'meteor/meteor';
import { Factory }     from 'meteor/dburles:factory';
import { assert }      from 'meteor/practicalmeteor:chai';

import { Permissions } from './permissions';
import                      '../factories/factories';

if (Meteor.isServer) {
  describe('Permissions', () => {
    describe('Interfaces', () => {
      it('should find a permission by its key', () => {
        const permission = Factory.create('permission');
        const result = Permissions.findByKey(permission.key);

        assert.deepEqual(permission, result);
      });
    });
  });
}
