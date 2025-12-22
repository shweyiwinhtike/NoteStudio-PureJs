'use strict';


/**
 * Attaches an event listener to a collection of DOM elements.
 *
 * @param {Array<HTMLElement>} $elements - An array of DOM elements to attach the event listener to.
 * @param {string} eventType - The type of event to listen for (e.g. 'click', 'mouseover').
 * @param {Function} callback - The function to be executed when the event occurs.
 */



const addEventOnElements = function ($elements, eventType, callback) {
    $elements.forEach($element => $element.addEventListener(eventType, callback));
}



/**
 * Generates a greeting message based on the current hour of the day.
 *
 * @param {number} currentHour - The current hour (0–23).
 * @returns {string} A greeting message for that time of day.
 */

const getGreetingMsg = function (currentHour) {
    // console.log("🚀 ~ utils.js:28 ~ getGreetingMsg ~ currentHour:", currentHour)
    const /**{string} */ greeting =
        currentHour < 5 ? 'Night' :
            currentHour < 12 ? 'Morning' :
                currentHour < 15 ? 'Noon' :
                    currentHour < 20 ? 'Evening' : 'Night';

    return `Good ${greeting}`;
}


let /**{HTMLElement | undefined} */ $lastActiveNavItem;

/**activitate a nav item by adding the 'active' class and deactivate the previously active item */
const activeNotebook = function () {
    $lastActiveNavItem?.classList.remove('active');
    this.classList.add('active'); //this: $navItem
    $lastActiveNavItem = this;//this: $navItem
}

/**make a dom element editable by setting the "contenteditable" attribut to true and focusing on it 
@param {HTMLElement} $element - the dom element make it editable**/


const makeElemEditable = function ($element) {
    $element.setAttribute('contenteditable', true);
    $element.focus();
}

/**
 * generates a unique ID based on the current timestamp
 * @returns {string} a string representation of the current timestamp
 */

const generateID = function () {
    return new Date().getTime().toString();
}


/**find a notebook in the database by its ID
 * 
 * @param {Object} db - the database containing the notebooks
 * @param {string} notebookId - the ID of the notebook to find
 * @returns {Object | undefined}  - the found notebook object, or undefined if not found
 */

const findNotebook = function (db, notebookId) {

    return db.notebooks.find(notebook => notebook.id === notebookId);
}


/**
 * Finds the index of a notebook in an array of notebooks based on its ID
 * 
 * @param {Object} db - the object containing an array of notebooks
 * @param {string} notebookId - the ID of the notebook to find
 * @returns {number} - the index of the found notebook, or -1 if not found
 */


const findNotebookIndex = function (db, notebookId) {
    return db.notebooks.findIndex(item => item.id === notebookId);
}

/**
 * converts a timestamp in milliseconds to a human-readable relative time string
 * 
 * @param {number} milliseconds  - the timestamp in milliseconds to convert
 * @returns {string} - a string representing the relative time (e.g., "Just now", "5 min ago", "3 Hours ago", "2 days ago")
 */
const getRelativeTime = function (milliseconds) {
    const /**{Number}*/currentTime = new Date().getTime();
    const /**{Number}*/ minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
    const /**{Number}*/ hour = Math.floor(minute / 60);
    const /**{Number}*/ day = Math.floor(hour / 24);

    // return minute < 1
    //     ? 'Just now'
    //     : minute < 60
    //         ? `${minute} min ago`
    //         : hour < 24
    //             ? `${hour} hour ago`
    //             : `${day} day ago`;

    return minute < 1
        ? 'Just now'
        : minute < 60
            ? `${minute} min${minute > 1 ? 's' : ''} ago`
            : hour < 24
                ? `${hour} hour${hour > 1 ? 's' : ''} ago`
                : `${day} day${day > 1 ? 's' : ''} ago`;

}

/**
 * Finds a specific note by its ID within a database of notebooks and their notes
 * 
 * @param {Object} db - the database containing notebooks and notes
 * @param {string} noteId - the id  of the note to find
 * @returns {Object | undefined} the found note object, or undefined if not found
 */

const findNote = (db, noteId) => {
    let note;
    for (const notebook of db.notebooks) {
        note = notebook.notes.find(note => note.id === noteId);
        if (note) break;
    }
    return note;
}


/**
 * finds the index of a note in a notebook's array of notes based oni ts ID
 * 
 * @param {Object} notebook - the notebook object containing an array of notes
 * @param {string} noteId - the id of the note to find
 * @returns {number} the index of the found note, or -1 if not found
 */
const findNoteIndex = function (notebook, noteId) {
    return notebook.notes.findIndex(note => note.id === noteId);
}



export {
    addEventOnElements,
    getGreetingMsg,
    activeNotebook,
    makeElemEditable,
    generateID,
    findNotebook,
    findNotebookIndex,
    getRelativeTime,
    findNote,
    findNoteIndex
}