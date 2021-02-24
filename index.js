
(function(global){

  global.App = function(options) {
    // A module is an object literal.
    // This module will only be accessed via closure.
    const module = {
      options, // options: options,
      alarms: [],
      std: true, // option?
      getPeriod: function(militaryHour) {
        if (militaryHour > 11) {
          return 'pm';
        } else {
          return 'am';
        }
      },
      convertToStd: function(militaryHour) {
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
      },
      padZero: function() {
        let args = Array.prototype.slice.call(arguments);
        return args.map(arg => {
          if (arg < 10) arg = '0' + arg;
          return arg;
        });
      },
      parseTime: function() {
        let now = new Date();
        let _hr = now.getHours(); 
        let _min = now.getMinutes();
        let _sec = now.getSeconds();
        let period = this.std ? this.getPeriod(_hr) : null; // should getPeriod get called inside convertToStd?
        _hr = this.std ? this.convertToStd(_hr) : _hr;
        let [hr, min, sec] = this.padZero(_hr, _min, _sec);
        now = `${hr} ${min} ${sec} ${period ? period : ''}`;
        return now;
      },
      startClock: function() {
        setInterval(function() {
          //console.log(this);
          let now = module.parseTime();
          let div = document.querySelector('#showtime');
          div.innerHTML = now;
          module.checkAlarms(now);
        }, 1000);
      },
      checkAlarms: function(now) {
        this.alarms.forEach(alarm => {
          if (now === alarm.time) {
            alert('ding dong!');
          }
        })
      },
      insertFormOptions: function() {
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
      },
      getAlarmFormData: function() {
        let timeString;
        let values = ['#hour', '#minute', '#second'].map(sel => {
          return document.querySelector(sel).value;
        });
        let parts = this.padZero(values[0], values[1], values[2]);
        timeString = parts.join(" ") + ' ' + this.getPeriodString();
        return timeString;
      },
      getPeriodString: function() {
        let radios = document.querySelectorAll('[name="period"]');
        let period;
        radios.forEach(rad => {
          if(rad.checked) period = rad.value;
        });
        return period;
      },
      getDescriptionString: function() {
        let desc = document.querySelector('#description').value;
        return desc;
      },
      createAlarmObject: function() {
        let alarm = {}; // new Alarm();
        alarm.time = this.getAlarmFormData();
        alarm.period = this.getPeriodString();
        alarm.description = this.getDescriptionString();
        alarm.element = document.createElement('li');
        alarm.element.style.display = "flex";
        alarm.element.style.justifyContent = "space-around";
        alarm.element.style.border = "1px solid black";
        console.log(alarm);
        return alarm;
      },
      createAlarmItem: function() {
        let alarmObj = this.createAlarmObject();
        let alarmItem = alarmObj.element;
        let desc = document.createElement('span');
        let time = document.createElement('span');
        desc.innerHTML = alarmObj.description;
        time.innerHTML = alarmObj.time;
        alarmItem.appendChild(desc);
        alarmItem.appendChild(time);
        return alarmObj;
      },
      render: function() {
        this.alarms.forEach(alarm => {
          document.querySelector('#alarms').appendChild(alarm.element);
        });
      },
      addAlarmAndRender: function() {
        let alarm = module.createAlarmItem();
        module.alarms.push(alarm);
        module.render();
      },
      init: function() {
        module.insertFormOptions();
        module.startClock();
        document.querySelector('button').addEventListener('click', module.addAlarmAndRender);
      }
    };

    // API
    return {
      on: module.init,
    }
  }

})(window);