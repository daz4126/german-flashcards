import {Nanny, html} from 'nanny-state'
import { flashcards } from './flashcards.js'

const randomNumber = n => Math.ceil(Math.random()*n)

function chooseFlashcard(flashcards){
  const choose = randomNumber(flashcards.length)
  return flashcards[choose]
}

const View = state =>
html`
<h1>GERMAN FLASHCARDS </h1>
${state.adding ? html`
<form onsubmit=${newCard}>
<label for="german">German: </label>
  <input type="text" name="german" class="userInput"></input>
<label for="english">English: </label>
  <input type="text" name="english" class="userInput"></input>

<div class="buttons">
  <button type="submit"><span>Add Card</span></button>
</div></form>`:
state.started ? html`
<div>
  <button class="flashcards" onclick=${e => Update({current: state.current === "german" ? "english" : "german"})}> <span>${state[state.current]}</span> </button>
  <button class="next-button" onclick=${e => Update(cards)}>NEXT</button>
</div>
<div class="buttons">
  <button onclick=${e => Update({showFirst: state.showFirst === "german" ? "english" : "german"})}><span>${state.showFirst === "german" ? "English-German" : "German-English"}</span></button>
  <button onclick=${e => Update({adding: true})}><span>ADD CARD</span></button>
  <button onclick=${e => Update(endCards)}><span>DELETE CARDS</span></button>
</div>`
: 
html`
<div class="buttons">
    <button onclick=${e => Update(cards)}><span>START</span></button></div>
    <ol id="flashcards"><span id="allCards">ALL CARDS:</span>
     ${state.flashcards.map(flashcard => html`
     <li>German: ${flashcard.german} - English: ${flashcard.english}
     <button class="delete-button" data-word="${flashcard.german}" onclick=${e => Update(deleteCard(e.target.dataset.word))}>DELETE</button></li>`
     )}
    </ol>
`}`

const newCard = event => {
  event.preventDefault()
  Update(addNewCard({english: event.target.english.value, german: event.target.german.value}))
}

const addNewCard = newFlashcard => state => ({
  flashcards: [...state.flashcards, newFlashcard],
  adding: false
})

const cards = state => ({
  started: true,
  current: state.showFirst,
  ...chooseFlashcard(state.flashcards),
})

const deleteCard = word => state => ({
  flashcards: state.flashcards.filter(flashcard => flashcard.german != word)
})

const endCards = state => ({
  started: false,
})

const State = {
  started: false,
  adding: false,
  current: "german",
  showFirst: "german",
  flashcards,
  LocalStorageKey: "German-flashcards",
  View
}

const Update = Nanny(State)