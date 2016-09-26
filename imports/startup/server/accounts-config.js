Accounts.onCreateUser(function(options, user){
  const service = Object.keys(user.services);
  let name = user.services[service].name;
  let email = user.services[service].email;
  let picture = user.services[service].picture;

  console.log('email on register', email, 'user', JSON.stringify(user.services[service], null, 2));

  user.emails = [{ address: email }];
  user.profile = {
    name,
    picture,
  };

  return user;
});
