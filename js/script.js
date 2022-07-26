import { emojis } from "./data.js"

const emojiContainer = document.querySelector("#emoji-container")
const listContainer = document.querySelector("#journal-list")
const inputEl = document.querySelector(".input-el")
const inputFormContainer = document.querySelector(".input-form-container")
const deleteAll = document.querySelector(".delete-btn")
let storage = window.localStorage

let entry = {} //entry info to display

/**
 * @param value emoji value passed to the function
 * used to update the input field
 * only one emoji at a time
 */
function emojiToInput(value) {
	if (inputEl.value.length === 0) {
		inputEl.value = value
	}
}


function renderEmojis() {
	let btnString = ""
	for (let i = 0; i < emojis.length; i++) {
		btnString += `<button class="emoji-value" value="${emojis[i]}" type="submit">${emojis[i]}</button>`
	}
	emojiContainer.innerHTML = btnString
}

function CreateEntry(timeInput) {
	entry.date = timeInput.getDate()
	entry.month = timeInput.getMonth()
	entry.dayInNumber = timeInput.getDay()
	entry.year = timeInput.getFullYear()
	entry.day = dayofWeek(entry.dayInNumber)
	entry.time = timeInput.toLocaleTimeString("en", {
		timeStyle: "short"
	})
	entry.mood = []
}


function handleSubmit(event) {
	event.preventDefault()
	//recent date
	let currentDate = new Date()
	const journal = localStorage.getItem("journal")=== null? [] : JSON.parse(localStorage.getItem("journal"))
	let val = inputEl.value
	if (val){
		if(journal.length > 0) {
			if (currentDate.getMonth() === journal[journal.length-1].month && 
			currentDate.getDate() === journal[journal.length-1].date && 
			currentDate.getFullYear() === journal[journal.length-1].year) {
					//same day: update existing entry
					journal[journal.length-1].mood.push(val)//update mood
					journal[journal.length-1].time = new Date().toLocaleTimeString("en", {	timeStyle: "short"})//time of last entry
					
				}else {//new day
					CreateEntry(new Date())
					entry.mood.push(val)
					journal.push(entry) //push popped or new entry
				} 
				
			}else {//empty journal
				CreateEntry(new Date())
				entry.mood.push(val)
				journal.push(entry) //push popped or new entry
			}
			inputEl.value = ""
			storage.setItem("journal", JSON.stringify(journal))
			renderJournal()
	}
}

function renderJournal() {
	const journal = localStorage.getItem("journal")=== null? [] : JSON.parse(localStorage.getItem("journal"))
	
	//recent date
	let currentDate = new Date()

	let entries = ""
	for (let j = journal.length - 1; j >= 0 ;j--) {
		let moodStr = journal[j].mood.map(m => m).join(" ")
	
		if (currentDate.getMonth() === journal[j].month && currentDate.getDate() === journal[j].date) {
			//include the day and time of entry
			entries += `
				<li>
				<div class="date">${journal[j].day} - ${journal[j].time}</div>
				<div class="entry">${moodStr}</div>
				</li>`
		} else if (currentDate.getDate() - journal[j].date >= 1 && currentDate.getDate() - journal[j].date <= 4) {
			//include only the day without time
			entries += `
            <li>
            <div class="date">${journal[j].day}</div>
            <div class="entry">${moodStr}</div>
            </li>`

		} else {
			//include full date, month, year
			entries += `
            <li>
            <div class="date">${journal[j].date}/${journal[j].month+1}/${journal[j].year}</div>
            <div class="entry">${moodStr}</div>
            </li>`
		}
	}
	listContainer.innerHTML = entries
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
			return "Sunday"
		case 1:
			return "Monday"
		case 2:
			return "Tuesday"
		case 3:
			return "Wednesday"
		case 4:
			return "Thursday"
		case 5:
			return "Friday"
		case 6:
			return "Saturday"
	}
}

//===================== Event Listeners & Function Calls========================

renderEmojis()

/**
 * load previous journal data, if available
 */
renderJournal()

/**
 * delete everything with a double click
 */
deleteAll.addEventListener("dblclick", function () {
	entry = {}
	storage.removeItem("journal")
	renderJournal()
})

/**
* listen for click on container and pass focus to input element
*/
emojiContainer.addEventListener("click", function (event) {
	if (event.target.classList.contains("emoji-value")) {
		emojiToInput(event.target.value)
		inputEl.focus()
	}
})

/**
* listen for click on container and add to current journal entry
*/
inputFormContainer.addEventListener("click", handleSubmit)
