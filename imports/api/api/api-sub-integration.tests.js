import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { printObject }          from '../helpers/print-objects.js';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';

import { ModuleInstances }      from '../module-instances/module-instances.js';

import { generateApi }          from './api-client.js';

Meteor.methods({
  'testing.resetDatabase': () => resetDatabase()
});

if (Meteor.isClient) {
  describe('API Subscriptions', function() {
    let user, moduleInstances, requests;
    let APIs = [];

    let before = function before() {
      Meteor.call('testing.resetDatabase');
      user = Factory.create('user');

      moduleInstances = [
        Factory.create('todosModuleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
        Factory.create('moduleInstance'),
      ];

      requests = [
        {
          collection: 'todos',
          condition: {
            $eq: ['$$element.categoryId', 'categoryId1']
          }
        }
      ];

      Meteor.users.insert(user);
      sinon.stub(Meteor, 'user', () => user);
      MeteorStubs.install();
      moduleInstances.forEach((moduleInstance, index, array) => {
        delete moduleInstance._id;
        Meteor.call('ModuleInstances.methods.create', moduleInstance, (err, res) => {
          console.log('err1', err);
          console.log('res', res);
          array[index] = res._id;
          APIs.push(generateApi(res._id));
          ModuleInstances.remove({ _id: moduleInstance._id });
        });
      });
    };

    let after = function after() {
      Meteor.user.restore();
      MeteorStubs.uninstall();
    };

    let check = function check(done) {
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
