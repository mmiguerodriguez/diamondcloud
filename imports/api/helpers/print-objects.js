// Print objects with functions

export let printObject = function() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(JSON.stringify(arguments[i], function(key, val) {
      return (typeof val === 'function' ? val + '' : val);
    }, 4));
  }
};
