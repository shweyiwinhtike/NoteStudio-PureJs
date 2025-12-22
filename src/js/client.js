'use strict';


/**
 * import module
 */

import { NavItem } from "./components/NavItem.js";
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";

const /**{HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');
const /**{HTMLElement} */ $notePanelTitle = document.querySelector('[data-note-panel-title]');
const /**{HTMLElement} */ $notePanel = document.querySelector('[data-note-panel]');
const /**{Array<HTMLElement} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const /**{string} */ emptyNotesTemplate = `
<div class="empty-notes">
    <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
    <div class="text-headline-small">No notes</div>
</div>
`;

/**
 * enables or disables "Create Note" buttons based on whether there are any notebooks.
 * @param {boolean} isThereAnyNotebooks - check whether there are any notebooks.
 */
const disableNoteCreateBtns = function (isThereAnyNotebooks) {
    $noteCreateBtns.forEach($item => {
        $item[isThereAnyNotebooks ? 'removeAttribute' : 'setAttribute']('disabled', '');
    });
}


/**
 * the client obj manages interactions with the user interface (UI) to create, read, update and delete te notebooks and notes. 
 * it provides functions for performing these operations and updating the UI accordingly.
 * 
 * @namespace
 * @property {Object} notebook -functions for managing notebooks in the ui
 * @property {Object} note - functons for managing the notes in the UI
 */


export const client = {

    notebook: {

        /**creates a new notebook in the UI, based on provided notebook data
         * @param {Object} notebookData - data representing the new notebook
         */

        create(notebookData) {
            const /**{HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebarList.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            $notePanel.innerHTML = emptyNotesTemplate;
            disableNoteCreateBtns(true);
        },


        /**Reads and displays a list of notebooks in the UI 
         * @param {Array<Object>} notebookList - list of notebook data to display
        */

        read(notebookList) {
            disableNoteCreateBtns(notebookList.length);
            notebookList.forEach((notebookData, index) => {
                const /**{HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);

                if (index === 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;
                }

                $sidebarList.appendChild($navItem);
            });
        },


        /**updates the UI to reflect changes in a notebook
         * 
         * @param {string} notebookId - ID of the notebook to update
         * @param {Object} notebookData - New data for the notebook
         */

        update(notebookId, notebookData) {
            const /**{HTMLElement} */ $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const /**{HTMLElement} */ $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebarList.replaceChild($newNotebook, $oldNotebook);
            activeNotebook.call($newNotebook);

        },


        /**
         * deletes a notebook from the UI
         * @param {string} notebookId - ID of the notebook to delete
         */

        delete(notebookId) {
            const/**{HTMLElement} */$deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const /**{HTMLElement | null} */ $ActiveNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if ($ActiveNavItem) {
                $ActiveNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreateBtns(false);
            }

            $deletedNotebook.remove();
        }







    },

    note: {
        /**
         * creates a new note card in the UI based on provided note data
         * @param {object} noteData - data representing the 
         * */
        create(noteData) {
            //clear 'empty notes template' from 'note panel' if there is no note exist
            if (!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';

            //Append card in notePanel
            const /**{HTMLElement} */ $card = Card(noteData);
            $notePanel.prepend($card);
        },

        /**
         * reads and displays a list of notes in the UI
         * 
         * @param {Array<Object>} noteList - lists of note data to display
         */
        read(noteList) {

            if (noteList.length) {
                $notePanel.innerHTML = '';

                noteList.forEach(noteData => {
                    const /**{HTMLElement} */ $card = Card(noteData);
                    $notePanel.appendChild($card);
                });
            } else {
                $notePanel.innerHTML = emptyNotesTemplate;
            }



        },


        /**
         *Updates a note card in the UI based on the provided note data
         * @param {string} noteId - ID of the note to update
         * @param {Object} noteData  - new data for the note
         */
        update(noteId, noteData) {
            const/**{HTMLElement} */ $oldCard = document.querySelector(`[data-note="${noteId}"]`);
            const/**{HTMLElement} */ $newCard = Card(noteData);
            $notePanel.replaceChild($newCard, $oldCard);
        },


        /**
         * deletes a note card from the UI
         * @param {string} noteId - id of the note to delete
         * @param {boolean} isNoteExists - indicates whether other notes still exist
         */
        delete(noteId, isNoteExists) {
            document.querySelector(`[data-note="${noteId}"]`).remove();
            if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplate;
        }
    }

}