import { emojis } from "./data.js";

const emojiContainer = document.querySelector("#emoji-container");
const listContainer = document.querySelector("#journal-list");
const inputEl = document.querySelector(".input-el");
const inputContainer = document.querySelector(".input-container");
const deleteAll = document.querySelector(".delete-btn");
let storage = window.localStorage;


let journal = []; //array to store entries objects

let entry = {}; //entry info to display

/*********** Date Manipulation ***********/
//recent date
let currentDate = new Date(); //used let for testing purposes
/******uncomment below when testing******/
// currentDate = new Date(2022,7,5,17,34,12);

//manipulate the date below to test other days


/**
 * @param value emoji value passed to the function
 * used to update the input field
 * only one emoji at a time
 */
function emojiToInput(value) {
	if (inputEl.value.length === 0) {
		inputEl.value = value;
	}
}


function renderEmojis() {
	let btnString = "";
	for (let i = 0; i < emojis.length; i++) {
		btnString += `<button class="emoji-value" value="${emojis[i]}" type="submit">${emojis[i]}</button>`;
	}
	emojiContainer.innerHTML = btnString;
}

function CreateEntry(timeInput) {
	entry.date = timeInput.getDate();
	entry.month = timeInput.getMonth();
	entry.mood = [];
	entry.dayInNumber = timeInput.getDay();
	entry.hours = timeInput.getHours();
	entry.minutes = timeInput.getMinutes();
	entry.year = timeInput.getFullYear();
	entry.day = dayofWeek(entry.dayInNumber);
}



function handleSubmit(event) {
	event.preventDefault()
	const journal = localStorage.getItem("journal")=== null? [] : JSON.parse(localStorage.getItem("journal"))
	let val = inputEl.value;
	if (val) {
		if (journal.length > 0) {
			entry = journal.pop();
			const {
				date,
				month,
				mood,
				...rest
			} = entry;
			if (currentDate.getMonth() === month && currentDate.getDate() === date) {
				//same day
				mood.push(val);
			} else {
				journal.push(entry); //replace old entry
				entry = {};
				CreateEntry(currentDate);
				mood.push(val);
			}

		} else {
			entry = {};
			CreateEntry(currentDate);
			entry.mood.push(val);
		}

		inputEl.value = "";

		journal.push(entry);
		storage.setItem("journal", JSON.stringify(journal));
		renderJournal();
	}
}


function renderJournal() {
	const journal = localStorage.getItem("journal")=== null? [] : JSON.parse(localStorage.getItem("journal"))
	let entries = "";
	for (let j = journal.length - 1; j >= 0; j--) {
		let moodStr = "";
		for (let m = 0; m < journal[j].mood.length; m++) { //access emoji array
			moodStr += journal[j].mood[m] + " ";
		}

		if (currentDate.getMonth() === journal[j].month && currentDate.getDate() - journal[j].date < 1) {
			//account for leading zero in minutes
			let leadZero = journal[j].minutes < 10 ? "0" : "";

			let time = `${journal[j].day} - ${journal[j].hours}:${leadZero}${journal[j].minutes}`;
			if (journal[j].hours < 12) {
				time += " am";
			} else {
				time += " pm";

			}

			entries += `
      <li>
      <div class="date">${time}</div>
      <div class="entry">${moodStr}</div>
      </li>`;
		} else if (currentDate.getDate() - journal[j].date >= 1 && currentDate.getDate() - journal[j].date <= 4) {
			//include day
			entries += `
            <li>
            <div class="date">${journal[j].day}</div>
            <div class="entry">${moodStr}</div>
            </li>`;

		} else {
			//include full date, month, year
			entries += `
            <li>
            <div class="date">${journal[j].date}/${journal[j].month+1}/${journal[j].year}</div>
            <div class="entry">${moodStr}</div>
            </li>`;
		}
	}
	listContainer.innerHTML = entries;
}

/**
 * helper function for CreateEntry
 * @param  num day of the week
 *
 * returns the equivalent string day
 */
function dayofWeek(num) {
	switch (num) {
		case 0:
			return "Sunday";
		case 1:
			return "Monday";
		case 2:
			return "Tuesday";
		case 3:
			return "Wednesday";
		case 4:
			return "Thursday";
		case 5:
			return "Friday";
		case 6:
			return "Saturday";
	}
}

//===================== Event Listeners & Function Calls========================

renderEmojis();

/**
 * load previous journal data, if available
 */
window.addEventListener("load", renderJournal);

/**
 * delete everything with a double click
 */
deleteAll.addEventListener("dblclick", function () {
	journal = [];
	entry = {};
	storage.removeItem("journal");
	renderJournal();
});

/**
* listen for click on container and pass focus to input element
*/
emojiContainer.addEventListener("click", function (event) {
	if (event.target.classList.contains("emoji-value")) {
		emojiToInput(event.target.value)
		inputEl.focus()
	}
});

/**
* listen for click on container and add to current journal entry
*/
inputContainer.addEventListener("click", handleSubmit);
