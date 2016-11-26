import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

import { Permissions } from './permissions';

if (Meteor.isServer) {
  describe('Permissions', () => {
    before(() => {
      
    });
    
    after(() => {
      
    });
    
    it('should attach default module permissions to the database', () => {
      console.log(Permissions.find().fetch());
    });
  });
}
