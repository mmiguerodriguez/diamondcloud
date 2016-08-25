import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { printObject }          from '../helpers/print-objects.js';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';

import { ModuleInstances }      from '../module-instances/module-instances.js';
import { createModuleInstance } from '../module-instances/methods.js';

import { generateApi }          from './api-client.js';

Meteor.methods({
  'testing.resetDatabase': () => resetDatabase(),
});

if (Meteor.isClient) {
  describe('API Subscriptions', function() {
    let user, moduleInstances, APIs, requests;

    let before = () => {
      Meteor.call('testing.resetDatabase');
      user = Factory.create('user');

      moduleInstances = [
        Factory.create('todosModuleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
      ];

      moduleInstances.forEach((moduleInstance) => delete moduleInstance._id);

      requests = [
        {
          collection: 'todos',
          condition: {
            $eq: ['$$element.categoryId', 'categoryId1']
          }
        }
      ];

      Meteor.call('testing.resetDatabase');
      APIs = [];
      moduleInstances.forEach((moduleInstance) => createModuleInstance.call(moduleInstance, (res) => APIs.push(generateApi(res._id))));
      Meteor.call('testing.resetDatabase');
      resetDatabase();
      Meteor.users.insert(user);
      sinon.stub(Meteor, 'user', () => user);
    };

    let after = () => {
      Meteor.user.restore();
    };

    let check = (done) => {
      // Code of 1st API consumer
      let reactiveData;
      let callback = (data) => reactiveData = data;
      APIs[0].subscribe({ request: requests[0], callback });
      console.log('reactiveData:', reactiveData);
      done();
    };

    beforeEach(before);
    afterEach(after);
    it('should let the API consumer subscribe to reactive data', check);
  });
}
