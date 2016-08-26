var resize;

window.onload = () => {
  console.log('I am a module and I just loaded');
};

window.onresize = () => {
  clearTimeout(resize);
  resize = setTimeout(() => {
    console.log('Resized module', {
      width: this.innerWidth,
      height: this.innerHeight,
    });
  }, 500);
};
