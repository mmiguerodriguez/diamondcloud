Accounts.onCreateUser(function(options, user){
  const service = Object.keys(user.services);
  let name = user.services[service].name;
  let email = user.services[service].email;
  let picture = user.services[service].picture;
  
  user.emails = [{ address: email }];
  user.profile = {
    name,
    picture,
  };

  return user;
});
