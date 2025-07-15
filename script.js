// relative to UTC
const clockOptions = {
  "Buenos Aires": -3,
  "England": 1,
  "Fiji": 13,
  "Los Angeles, USA": -7,
  "New Delhi, India": 6,
  "New Zealand": 12,
  "Samoa": 13,
  "Tokyo, Japan": 9,  
  "Washington, USA": -4,
}

let hours;
let minutes;
let seconds;
let offset;


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
  // convert offset to hours
  offset = Math.floor(time.getTimezoneOffset() / 60);
  if (offset < 0) {
    offset += 24;
  }
}

const pollTime = () => {
  const time = new Date();
  hours = time.getUTCHours();
  minutes = time.getUTCMinutes();
  seconds = time.getUTCSeconds();
  // console.log("time polled!")
}

const getTimeString = (h, m, s) => {
  console.log(h, m, s);
  let tzHours = h % 24;
  if (tzHours < 0) {
    tzHours += 24;
  }
  let timeAmPm = "AM";
  if (tzHours > 12) {
    timeAmPm = "PM";
  }
  let hoursAmPm = tzHours % 12;
  if (hoursAmPm == 0) {
    hoursAmPm = 12;
  }
  let timeString = `${hoursAmPm.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} ${timeAmPm}`;
  return timeString;
}

const showTime = () => {
  const baseTimeString = getTimeString(hours + offset, minutes, seconds);
  document.querySelector("#local-clock").innerHTML = baseTimeString;
  const worldClockList = document.querySelector('#world-clocks');
  for (const child of worldClockList.children) {
    const tz = parseInt(child.children[1].innerHTML);
    const clockTimeString = getTimeString(hours + tz, minutes, seconds);
    child.children[0].innerHTML = clockTimeString;
  }
}

const updateTime = () => {
  seconds += 1;
  if (seconds == 60) {
    minutes += 1;
    seconds = 0;
  }
  if (minutes == 60) {
    hours += 1;
    minutes = 0;
  }
  if (hours >= 24) {
    hours = 0;
  }
}

const addClock = (tzLocation) => {
  // search for existing clock with this location
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
  }, 1000);
  setInterval(() => {
    pollTime();
  }, 60000);
  document.querySelector("#add-clock-btn").addEventListener('click', () => {
    const select = document.querySelector("#clock-select");
    const tzLocation = select.value;
    addClock(tzLocation);
  });
}