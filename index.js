// a domain object has both a model and a view
// the domain objects for this app are clock and alarm. clock has a one-to-many relation with alarm.
// when we realize that a clock is a corresponding pair of view and model, then we realize that we
// can have multiple clocks -> multipe divs. the divs could share the same model instance, while having
// different view styles and even different html elements.
let alarms = []; // model ie data
let std = true; // state: military vs standard

// determine the period for the clock, based on the default military time
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
function Clock() {
  return {
    start: function() { 
      setInterval(tick, 1000); 
    },
  }
}

// where the clock and the alarms meet
const tick = () => {
  let now = parseTime();
  // display the current time
  let div = document.querySelector('#showtime');
  div.innerHTML = now;
  // check to see if the current time matches what the alarms set to
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
function insertFormOptions() {
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
function getAlarmFormData() {
  let timeString;
  let values = ['#hour', '#minute', '#second'].map(sel => {
    return document.querySelector(sel).value;
  });
  let parts = padZero(values[0], values[1], values[2]);
  timeString = parts.join(" ") + ' ' + getPeriodString();
  return timeString;
}

// "am" or "pm" ?
function getPeriodString() {
  let radios = document.querySelectorAll('[name="period"]');
  let period;
  radios.forEach(rad => {
    if(rad.checked) period = rad.value;
  });
  return period;
}

// Tell us what you need to be reminded of at this time.
function getDescriptionString() {
  let desc = document.querySelector('#description').value;
  return desc;
}

// Alarm model
function createAlarmObject() {
  let alarm = {}; // new Alarm();
  alarm.time = getAlarmFormData();
  alarm.period = getPeriodString();
  alarm.description = getDescriptionString();
  alarm.element = document.createElement('li');
  console.log(alarm);
  return alarm;
}

function createAlarmItem() {
  let alarmObj = createAlarmObject();
  let alarmItem = alarmObj.element;
  let desc = document.createElement('span');
  let time = document.createElement('span');
  desc.innerHTML = alarmObj.description;
  time.innerHTML = alarmObj.time;
  alarmItem.appendChild(desc);
  alarmItem.appendChild(time);
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