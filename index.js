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
  if (militaryHour > 12) {
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

const parseTime = () => {
  let now = new Date();
  let hr = now.getHours(); 
  let min = now.getMinutes();
  let sec = now.getSeconds();
  let period = std ? getPeriod(hr) : null; // must get period before converting hour wrt logic above
  hr = std ? convertToStandard(hr) : hr;
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
  let a = setInterval(tick, 1000);
  //clearInterval(a);
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
  let values = ['#hour', '#minute', '#second', '[name="period"]'].map(sel => {
    return document.querySelector(sel).value;
  });
  console.log(values);
  alarmTime = values.join(" ");
  document.querySelector('#alarm').innerHTML = alarmTime;
}

function checkAlarm(now) {
  if (now === alarmTime) {
    alert('ding dong!');
  }
}

const go = function() {
  filloutOptions();
  startClock();
  document.querySelector('button').addEventListener('click', setAlarm);
}

go();