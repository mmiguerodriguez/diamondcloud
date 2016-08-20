// Print objects with functions

export const printObject = (obj) => {
  console.log(JSON.stringify(obj, function(key, val) {
    return (typeof val === 'function' ? val + '' : val);
  }, 4));
};
