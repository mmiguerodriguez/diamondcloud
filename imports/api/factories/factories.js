import faker		     from 'faker';
import { Random }    from 'meteor/random';

import { Teams }           from '../teams/teams.js';
import { Boards }          from '../boards/boards.js';
import { Messages }        from '../messages/messages.js';
import { DirectChats }     from '../direct-chats/direct-chats.js';
import { ModuleInstances } from '../module-instances/module-instances.js';

Factory.define('user', Meteor.users, {
	emails: [ { address: faker.internet.email() } ],
});

Factory.define('board', Boards, {
	name: faker.lorem.word(),
	isPrivate: null,
	users: [],
	moduleInstances: [],
	archived: false,
});

Factory.define('team', Teams, {
	name: faker.company.companyName(),
	plan: Random.choice(['free', 'premium']),
	type: Random.choice(['web', 'android', 'ios', 'marketing']),
	boards: [],
	users: [
		{ email: faker.internet.email(), permission: 'owner' }
	],
	archived: false,
});

Factory.define('publicBoard', Boards, Factory.extend('board', {
	isPrivate: false,
	users: undefined,
}));

Factory.define('privateBoard', Boards, Factory.extend('board', {
	isPrivate: true,
	users: [
		{ _id: Factory.get('user')._id },
	],
}));

Factory.define('directChat', DirectChats, {
	teamId: Factory.get('team'),
	users: [
		{ _id: Random.id() },
		{ _id: Random.id() },
	]
});

Factory.define('message', Messages, {
	senderId: Factory.get('user')._id,
	type: "text",
	content: faker.lorem.sentence(),
	createdAt: new Date(),
});

Factory.define('directChatMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('directChat')._id,
}));

Factory.define('boardMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('board'),
}));

Factory.define('moduleInstance', ModuleInstances, {
	moduleId: Random.id(),
	x: faker.random.number(),
	y: faker.random.number(),
	width: faker.random.number({ min: 0, max: 1920 }),
	height: faker.random.number({ min: 0, max: 1080 }),
	vars: {},
	archived: false,
});
