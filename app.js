// instead of calling global functions, make the functions available through an API.
// then the alarm clock can be made customizable with options that get passed in.

const start = function() {
  insertFormOptions();
  Clock().start();
  document.querySelector('button').addEventListener('click', addAlarmAndRender);
}

document.body.onload = start;