const MS_PER_SEC = 1000;

// relative to UTC
const clockOptions = {
  "England": 1 * MS_PER_HOUR,
  "Los Angeles, USA": -7  * MS_PER_HOUR,
  "New Delhi, India": 6 * MS_PER_HOUR,
}

let offset;
let timestamp;

const initialiseClockSelections = () => {
  
}

const initialiseLocalOffset = () => {
  const time = new Date();
  offset = time.getTimezoneOffset();
  if (offset < 0) {
    offset += 24;
  }
}

const pollTime = () => {
}

window.onload = () => {
  initialiseClockSelections();
  initialiseLocalOffset();
  pollTime();
}