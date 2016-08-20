import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { printObject }          from '../helpers/print-objects.js';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';

import { ModuleInstances }      from '../module-instances/module-instances.js';

import { DiamondAPI }           from './api-client.js';

if (Meteor.isClient) {
  describe('Modules API', () => {
    describe('Client subscriptions', () => {
      let user, moduleInstances, requests, callback, reactiveData;

      beforeEach(function() {
        resetDatabase();

        user = Factory.create('user');

        moduleInstances = [
          Factory.create('todosModuleInstance'),
          Factory.create('moduleInstance'),
        ];

        requests = [
          {
            collection: 'todos',
            condition: {
              $eq: ['$$element.boardId', 'designBoardId'],
            },
          },
          {
            collection: 'categories',
            condition: {
              $eq: ['$$element.color', 'red'],
            },
          },
        ];

        callback = (data) => reactiveData = data;

        resetDatabase();

        Meteor.users.insert(user);
        moduleInstances.forEach((moduleInstance) => ModuleInstances.insert(moduleInstance));
        sinon.stub(Meteor, 'user', () => user);

        sinon.stub(Meteor, 'subscribe', (subscriptionName, moduleInstanceId, request, callbackFunctions) => {
          if (moduleInstanceId == moduleInstances[0]._id) {
            if (request.collection == 'categories') {
              return [
                {
                  _id: 'categoryId1',
                  name: 'Lorem ipsum category',
          				color: 'red',
                },
                {
                  _id: 'categoryId2',
                  name: 'Another great category',
          				color: 'red',
                }
              ];
            } else if (request.collection == 'todos') {
              return [
                {
                  name: 'Design landing wireframe',
                  boardId: 'designBoardId',
                  users: [
                    { _id: "ryanId" },
                  ],
                  categoryId: 'categoryId1',
                }
              ];
            }
          } else if (moduleInstanceId == moduleInstances[1]._id) {
            callbackFunctions.onReady();
          }
        });
      });

      afterEach(function() {
        Meteor.user.restore();
      });

      it('should get the requested data when subscribing', (done) => {
        // Here comes the code that an API consumer would write.
        DiamondAPI.subscribe(moduleInstances[0]._id, requests[0], callback);
        // Checking everything works
        done();
      });
    });
  });
}
