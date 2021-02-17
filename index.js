// daily reminders, alarms, notifications, scheduler

// click on each item to display directions/info in a tile/card

//https://code-boxx.com/simple-javascript-alarm-clock/

// start with a naive procedural approach, then convert to classes later on

/*
function taskAlarm() {
  return new taskAlarm.init();
}

taskAlarm.init = function() {
  this.tasks = [];
  this.description = '';
  this.what = '';
}

taskAlarm.init.prototype = taskAlarm.prototype;

taskAlarm.prototype = {
  checkAlarm: checkAlarm,
}; */

//-------------------------------------------------------------------
let alarmTime = null;
let std = true; // military vs standard

const getPeriod = (militaryHour) => {
  if (militaryHour > 11) {
    return 'pm';
  } else {
    return 'am';
  }
}

const convertToStandard = (militaryHour) => {
  let hr = militaryHour;

  // 0th hour in military time is 12 am standard time
  if (hr === 0) {
    return 12;
  }
  // 12th hour in military time is 12 pm standard time
  else if (hr > 12) {
    return hr - 12;
  }

  else {
    return hr;
  }
}

function padZero() {
  let args = Array.prototype.slice.call(arguments);
  return args.map(arg => {
    if (arg < 10) arg = '0' + arg;
    return arg;
  });
}

const parseTime = () => {
  let now = new Date();
  let _hr = now.getHours(); 
  let _min = now.getMinutes();
  let _sec = now.getSeconds();
  let period = std ? getPeriod(_hr) : null; // must get period before converting hour wrt logic above
  _hr = std ? convertToStandard(_hr) : _hr;
  let [hr, min, sec] = padZero(_hr, _min, _sec);
  now = `${hr} ${min} ${sec} ${period ? period : ''}`;
  return now;
}

const tick = () => {
  let now = parseTime();
  // display the current time
  document.querySelector('#showtime').innerHTML = now;
  // check to see if the current time matches what the alarm clock is set to
  checkAlarm(now);
}

function startClock() {
  setInterval(tick, 1000);
}

function filloutOptions() {
  let i, j;
  const dropDownLists = document.querySelectorAll('select');
  dropDownLists.forEach(select => {
    if (select.id === 'hour') {
      i = 1; j = 13;
    } else {
      i = 0; j = 60;
    }
    for (; i < j; i++) {
      let option = document.createElement('option');
      option.innerHTML = i + '';
      select.appendChild(option);
    }
  });
}

function setAlarm() {
  let values = ['#hour', '#minute', '#second'].map(sel => {
    return document.querySelector(sel).value;
  });
  let radios = document.querySelectorAll('[name="period"]');
  let period;
  radios.forEach(rad => {
    if(rad.checked) period = rad.value;
  });
  let parts = padZero(values[0], values[1], values[2]);
  alarmTime = parts.join(" ") + ' ' + period;
  document.querySelector('#alarm').innerHTML = alarmTime;
}

function checkAlarm(now) {
  if (now === alarmTime) {
    alert('ding dong!');
  }
}

const start = function() {
  filloutOptions();
  startClock();
  document.querySelector('button').addEventListener('click', setAlarm);
}

document.body.onload = start;