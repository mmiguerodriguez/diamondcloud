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

if (Meteor.isClient) {
  describe('API Subscriptions', function() {
    let user, moduleInstances, APIs, requests;

    let before = () => {
      resetDatabase();
      user = Factory.create('user');

      moduleInstances = [
        Factory.create('todosModuleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
      ];

      APIs = [];
      moduleInstances.forEach((moduleInstance) => APIs.push(generateApi(moduleInstance._id)));

      requests = [
        {
          collection: 'todos',
          condition: {
            $eq: ['$$element.categoryId', 'categoryId1']
          }
        }
      ];

      resetDatabase();
      Meteor.users.insert(user);
      moduleInstances.forEach((moduleInstance) => createModuleInstance.call(moduleInstance));
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
