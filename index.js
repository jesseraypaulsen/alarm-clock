
let alarms = []; // model ie data
let std = true; // state: military vs standard

// clock
const getPeriod = (militaryHour) => {
  if (militaryHour > 11) {
    return 'pm';
  } else {
    return 'am';
  }
}

// clock
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

// clock and alarm
function padZero() {
  let args = Array.prototype.slice.call(arguments);
  return args.map(arg => {
    if (arg < 10) arg = '0' + arg;
    return arg;
  });
}

// clock only
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


// the core of the app
function startClock() {
  setInterval(tick, 1000);
}

// where the clock and the alarms meet
const tick = () => {
  let now = parseTime();
  // display the current time
  document.querySelector('#showtime').innerHTML = now;
  // check to see if the current time matches what the alarm clock is set to
  checkAlarms(now);
}

//TODO: needs to be asynchronous
function checkAlarms(now) {
  //this.alarms...
  alarms.forEach(alarm => {
    if (now === alarm.time) {
      alert('ding dong!');
    }
  })
}   
  // we have a one-to-many relationship between 'now' and the alarms, 
  // which makes me wonder if data-binding might be appropriate here.

// alarm only
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

//TODO: add validation
function getAlarmTime() {
  let alarmTime;
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
  
  return alarmTime;
}

function getAlarmDescription() {
  let desc = document.querySelector('#description').value;
  return desc;
}

function createAlarmObject() {
  let alarm = {};
  alarm.time = getAlarmTime();
  alarm.description = getAlarmDescription();
  alarm.element = document.createElement('li');
  console.log(alarm);
  return alarm;
}

function createAlarmItem() {
  let alarmObj = createAlarmObject();
  let desc = document.createElement('span');
  let time = document.createElement('span');
  desc.innerHTML = alarmObj.description;
  time.innerHTML = alarmObj.time;
  alarmObj.element.appendChild(desc);
  alarmObj.element.appendChild(time);
  return alarmObj;
}

function addAlarmAndRender() {
  let alarm = createAlarmItem();
  alarms.push(alarm);
  render();
}

function render() {
  alarms.forEach(alarm => {
    document.querySelector('#alarms').appendChild(alarm.element);
  });
}