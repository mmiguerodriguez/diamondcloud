// Ultra Map function

_.ultraMap = (arr, func) => {
  let result;
  arr = arr.map(func);

  arr.forEach((e) => {
    if (e !== undefined) {
      result.push(e);
    }
  });

  return result;
};
