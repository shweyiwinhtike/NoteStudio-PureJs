'use strict';


/**import modules */

import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utils.js";



//database object
let /**{object} */ notekeeperDB = {};


/**initialize a local database. if the data exists in local storage, it is loaed
 * otherwise a new empty database structure is created and stored
 */

const initDB = function () {

    const /** {JSON | undefined} */ db = localStorage.getItem('notekeeperDB');
    if (db) {
        notekeeperDB = JSON.parse(db);
    } else {
        notekeeperDB.notebooks = [];
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
    }

}

initDB();

/**Reads and loads the localStorage data into the global variable `notekeeperDB`*/

const readDB = function () {
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
}

/**Write the current state of the global varibale `notekeeperDB` to local storage */
const writeDB = function () {
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
}




/**Collection of functions for perforiming CRUD operations on the database
 * 
 * the database state is managed using global variables and local storage
 * 
 * @namespace
 * @property {object} get - functions for retrieving data from the database
 * @property {object} post - functions for adding data to the database
 * @property {object} update - functions for updating data in the database
 * @property {object} delete - functions for deleting the data from the database
 * 
 */






export const db = {

    post: {

        /**
         *adds a new notebook to the database 
         * 
         * @function
         * @param {string} name - the name of the new notebook
         * @returns {object} - the newly created notebook object
         */

        notebook(name) {
            readDB();

            const /**{object} */ notebookData = {
                id: generateID(),
                name,
                notes: []
            }

            notekeeperDB.notebooks.push(notebookData);

            writeDB();
            return notebookData;

        },

        /**
         * adds a new note to a specified notebook in the database.
         * @function
         * @param {string} notebookId - the id of the notebook to add the note inro
         * @param {Object} object - the note object to add.
         * @returns {Object} the newly created note object
         */

        note(notebookId, object) {
            readDB();

            const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            const /**{Object} */ noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }
            notebook.notes.unshift(noteData);
            writeDB();

            return noteData;
        }
    },

    get: {

        /**Retrieves all notebooks from the database
         * @function 
         * @returns {Array<Object>}
         */

        notebook() {
            readDB();

            return notekeeperDB.notebooks;
        },


        /**
         * Retrives all notes within a specified notebook
         * 
         * @function
         * @param {string} notebookId - the ID of the notebook to retrives notes from
         * @returns {Array<Object>} an array of note objects
         */
        note(notebookId) {
            readDB();
            const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            return notebook.notes;
        }

    },

    update: {

        /**
         * 
         * @function
         * @param {string} notebookId - the id of the notebook to update
         * @param {string} name - the new name for the notebook
         * @returns {Object} The updated notebook object
         *  */
        notebook(notebookId, name) {
            readDB();

            const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            notebook.name = name;


            writeDB();
            return notebook;
        },

        /**
         * Updates the content of a note in the database
         * @function
         * @param {string} noteId - the id of the note to update
         * @param {Object} object - the updated data for the note
         * @returns {Object} - the updated note object
         */
        note(noteId, object) {
            readDB();

            const /**{Object} */oldNote = findNote(notekeeperDB, noteId);
            const/**{Object} */ newNote = Object.assign(oldNote, object);
            writeDB();

            return newNote;
        }
    },


    delete: {

        /**
         * Deletes a notebook from the database
         * @function
         * @param {string} notebookId - the id of the notebook to delete
         */
        notebook(notebookId) {

            readDB();
            const /**{Number} */ notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
            notekeeperDB.notebooks.splice(notebookIndex, 1);

            writeDB();

        },


        /**
         * deletes anote from the specific notebook in the database
         * 
         * @function
         * @param {string} notebookId - the id of the notebook containing the note to delete
         * @param {string} noteId - the id of the note to delete
         * @returns {Array<Object>} An array of remaining notes in the note book
         */
        note(notebookId, noteId) {
            readDB();

            const /**{Object} */ notebook = findNotebook(notekeeperDB, notebookId);
            const /**{number} */ noteIndex = findNoteIndex(notebook, noteId);

            notebook.notes.splice(noteIndex, 1);

            writeDB();

            return notebook.notes;
        }


    }

}

