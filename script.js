const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;
const MS_PER_HOUR = 60 * 60 * MS_PER_SEC;
const HOURS_PER_DAY = 24;
const DAYNAME = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// relative to UTC
const clockOptions = {
  "Buenos Aires": -3 * MS_PER_HOUR,
  "England": 1 * MS_PER_HOUR,
  "Fiji": 13 * MS_PER_HOUR,
  "Los Angeles, USA": -7  * MS_PER_HOUR,
  "New Delhi, India": 6 * MS_PER_HOUR,
  "New Zealand": 12 * MS_PER_HOUR,
  "New Zealand (Chatham Is.)": 12 * MS_PER_HOUR + 45 * MS_PER_MIN,
  "Samoa": 13 * MS_PER_HOUR,
  "Tokyo, Japan": 9 * MS_PER_HOUR,  
  "Washington, USA": -4 * MS_PER_HOUR,
}

let offset;
let timestamp;



const initialiseClockSelections = () => {
  const select = document.querySelector("#clock-select");
  for (const location in clockOptions) {
    const option = document.createElement("option")
    option.value = location;
    option.innerHTML = location;
    select.appendChild(option);
  }
}

const initialiseLocalOffset = () => {
  const time = new Date();
  // convert offset to milliseconds
  offset = time.getTimezoneOffset() * MS_PER_MIN;
  if (offset < 0) {
    offset += (HOURS_PER_DAY * MS_PER_HOUR);
  }
}

const pollTime = () => {
  const time = new Date();
  timestamp = time.getTime();
  timestamp -= timestamp % MS_PER_SEC;
}

const getTimeString = (t) => {
  let tzHours = Math.floor(t / MS_PER_HOUR) % 24;
  let m = Math.floor(t / MS_PER_MIN) % 60;
  let s = Math.floor(t / MS_PER_SEC) % 60;
  if (tzHours < 0) {
    tzHours += HOURS_PER_DAY;
  }
  let timeAmPm = "AM";
  if (tzHours > 12) {
    timeAmPm = "PM";
  }
  let hoursAmPm = tzHours % 12;
  if (hoursAmPm === 0) {
    hoursAmPm = 12;
  }
  let day = (new Date(t)).getDay();
  
  let timeString = `${DAYNAME[day].toUpperCase()}\t${hoursAmPm.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} ${timeAmPm}`;
  return timeString;
}

const showTime = () => {
  const baseTimeString = getTimeString(timestamp + offset);
  document.querySelector("#local-clock").innerHTML = baseTimeString;
  const worldClockList = document.querySelector('#world-clocks');
  for (const child of worldClockList.children) {
    const tz = parseInt(child.children[1].innerHTML);
    const clockTimeString = getTimeString(timestamp + tz);
    child.children[0].innerHTML = clockTimeString;
  }
}

const updateTime = () => {
  timestamp += MS_PER_SEC;
}

const addClock = (tzLocation) => {
  // search for existing clock with this location
  console.log("Add clock: ", tzLocation)
  const spans = document.querySelectorAll("span.location");
  for (const e of spans) {
    if (e.innerHTML == tzLocation) {
      return;
    }
  }
  const newElement = document.createElement('li');
  const newSpanClock = document.createElement('span');
  const newSpanTZ = document.createElement('span');
  const newSpanName = document.createElement('span');
  const newButtonDelete = document.createElement('button');
  newElement.appendChild(newSpanClock);
  newElement.appendChild(newSpanTZ);
  newElement.appendChild(newSpanName);
  newElement.appendChild(newButtonDelete);
  newSpanClock.className = "clock";
  newSpanTZ.toggleAttribute("hidden")
  newSpanName.className = "location";
  const tz = clockOptions[tzLocation];
  newSpanClock.innerHTML = "00:00:00 XX";
  newSpanTZ.innerHTML = tz;
  newSpanName.innerHTML = tzLocation;
  newButtonDelete.innerHTML = "X";
  newButtonDelete.className = "delete-btn";
  newButtonDelete.addEventListener('click', () => {
    document.querySelector('#world-clocks').removeChild(newElement);
    console.log("Remove Clock: ", tzLocation);
  });
  document.querySelector('#world-clocks').appendChild(newElement);
  showTime();
}

window.onload = () => {
  initialiseClockSelections();
  initialiseLocalOffset();
  pollTime();
  showTime();
  setInterval(() => {
    updateTime();
    showTime();
  }, MS_PER_SEC);
  setInterval(() => {
    pollTime();
  }, 15 * MS_PER_MIN);
  document.querySelector("#add-clock-btn").addEventListener('click', () => {
    const select = document.querySelector("#clock-select");
    const tzLocation = select.value;
    addClock(tzLocation);
  });
}