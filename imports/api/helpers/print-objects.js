// Print objects with functions

_.printObject = () => {
  for (let i = 0; i < arguments.length; i++) {
    console.log(JSON.stringify(arguments[i], function(key, val) {
      return (typeof val === 'function' ? val + '' : val);
    }, 4));
  }
};
