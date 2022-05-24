const emojis = [
  "✌",  "😂",  "😝",  "😁",  "😱",  "👉",  "🙌",  "🍻",
  "🔥",  "🌈",  "☀",  "🎈",  "🌹",  "💄",  "🎀",  "⚽",
  "🎾",  "🏁",  "😡",  "👿",  "🐻",  "🐶",  "🐬",  "🐟",
  "🍀",  "👀",  "🚗",  "🍎",  "💝",  "💙",  "👌",  "❤",
  "😍",  "😉",  "😓",  "😳",  "💪",  "💩",  "🍸",  "🔑",
  "💖",  "🌟",  "🎉",  "🌺",  "🎶",  "👠",  "🏈",  "⚾",
  "🏆",  "👽",  "💀",  "🐵",  "🐮",  "🐩",  "🐎",  "💣",
  "👃",  "👂",  "🍓",  "💘",  "💜",  "👊",  "💋",  "😘",
  "😜",  "😵",  "🙏",  "👋",  "🚽",  "💃",  "💎",  "🚀",
  "🌙",  "🎁",  "⛄",  "🌊",  "⛵",  "🏀",  "🎱",  "💰",
  "👶",  "👸",  "🐰",  "🐷",  "🐍",  "🐫",  "🔫",  "👄",
  "🚲",  "🍉",  "💛",  "💚",
];

const bodyEl = document.querySelector(".body-tag");
const emojiContainer = document.querySelector("#emoji-container");
const listContainer = document.querySelector("#list-container");
const emojiAll = document.querySelectorAll(".emoji");
const inputEl = document.querySelector(".input-el");
const saveBtn = document.querySelector(".save-btn");
const deleteAll = document.querySelector(".delete-btn");
let storage = window.localStorage;

/**
 * array to store objects / entries
 */
let journal = [];

/**
 * entry info to display
 */
let entry = {};

renderEmojis();
renderJournal();

/**
 * display a box of clickable emojis
 */
function renderEmojis() {
  let btnString = "";
  for (let i = 0; i < emojis.length; i++) {
    btnString += `<button class="emoji" value="${emojis[i]}" onclick="log(this.value)">${emojis[i]}</button>`;
  }
  emojiContainer.innerHTML = btnString;
}

/**
 * 
 * @param value emoji value passed to the function
 * used to update the input field
 * only one emoji at a time
 */
function log(value) {
  if (inputEl.value.length === 0) {
    inputEl.value = value;
  }
}

/**
 * Save the emoji to the proper entry array
 * update same array until change of day
 * 
 * ***can also access the last entry without 
 * ***removing from journal
 */
saveBtn.addEventListener("click", function () {
  if (inputEl.value) {
    //recent date
    // const currentDate = new Date();//comment out if testing

    //manipulate current date below to test other days
    const currentDate = new Date(2022,4,10,3,55,0);

    let storedJournal = storage.getItem("journal"); //try to retrieve from storage
    if (storedJournal) {
      //value in storage i.e not null
      journal = JSON.parse(storedJournal);
      entry = journal.pop();//last entry
      if (currentDate.getDate() > entry.date) {
        //new day
        journal.push(entry);//return old entry to journal
        entry = {};
        updateEntry(currentDate);
      }
    } else {
      //nothing in storage, create an entry
      entry = {};
      updateEntry(new Date());
    }

    //update mood
    if (inputEl.value) {
      entry.mood.push(inputEl.value);
      inputEl.value = ""; //clear input field
    }

    //update journal
    journal.push(entry); //updated or new entry insert in journal
    //update localStorage
    storage.setItem("journal", JSON.stringify(journal));
    //render journal to page
    renderJournal();
  }
});

function renderJournal() {
  let entries = "";
  for (let j = 0; j < journal.length; j++) {
    //loop through entry.mood
    let moodStr = "";
    for (let m = 0; m < journal[j].mood.length; m++) {
      moodStr += journal[j].mood[m] + " ";
    }

    //account for leading zero in minutes
    let leadZero = journal[j].minutes<10? "0":"";

    let time =`${journal[j].day} - ${journal[j].hours}:${leadZero}${journal[j].minutes}`;
    if(journal[j].hours < 12){
        time += " am";
    } else{
        time += " pm";

    }
    
    entries += `
        <li>
            <div class="date">${time}</div>
            <div class="entry">${moodStr}</div>
        </li>`;
  }
  listContainer.innerHTML = entries;
}

function updateEntry(timeInput) {
  entry.date = timeInput.getDate();
  entry.dayNum = timeInput.getDay();
  entry.hours = timeInput.getHours();
  entry.minutes = timeInput.getMinutes();
  entry.mood = [];
  entry.day = dayofWeek(entry.dayNum);
}

/**
 * helper function for updateEntry
 * @param  num day of the week
 *
 * returns the equivalent string day
 */
function dayofWeek(num) {
  switch (num) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
  }
}

/**
 * load previous journal data, if available
 */
window.addEventListener("load", function () {
    if (storage.getItem("journal")) {
        journal = JSON.parse(storage.getItem("journal"));
    } else {
        journal = [];
    }
    renderJournal();
});

/**
 * delete everything with a double click
 */
deleteAll.addEventListener("dblclick", function () {
  journal = [];
  entry = {};
  storage.removeItem("journal");
  renderJournal();
});