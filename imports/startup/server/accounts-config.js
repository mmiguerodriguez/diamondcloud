Accounts.onCreateUser(function(options, user){
  const service = Object.keys(user.services);
  let email = user.services[service].email;

  user.emails = [{ address: email }];
  user.profile = {
    name: user.services[service].name,
  };

  return user;
});
