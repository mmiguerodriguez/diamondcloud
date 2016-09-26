import '/imports/startup/server';
import { Random } from 'meteor/random';

let n = 0;

for (let i = 1; i <= n; i++) {
  console.log(`ID ${ i }) ${ Random.id() }`);
}
