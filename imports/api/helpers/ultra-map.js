// Ultra Map function

Array.prototype.ultraMap = (func) => {
  let result;
  let arr = this.map(func);

  arr.forEach((e) => {
    if (e !== undefined) {
      result.push(e);
    }
  });

  return result;
};
