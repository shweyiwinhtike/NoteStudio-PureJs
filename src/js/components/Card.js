'use strict';

/**import module */
import { tooltip } from "./Tooltip.js";
import { getRelativeTime } from "../utils.js";
import { DeleteConfirmModal, NoteModal } from "./Modal.js";
import { db } from "../db.js";
import { client } from "../client.js";

/**Creates a HTML card element representing a note based on provided note
 * @param {Object} noteData - Data representinf the note to be displayed in the card
 * 
 * @returns {HTMLElement} - the generated card element
 */
export const Card = function (noteData) {

    const { id, title, text, postedOn, notebookId } = noteData;
    const /**{HTMlElement} */ $card = document.createElement('div');
    $card.classList.add('card');
    $card.setAttribute('data-note', id);

    $card.innerHTML = `
    <h3 class="card-title text-title-medium">${title}</h3>

                <p class="card-text text-body-large">${text}</p>

                <div class="wrapper">


                    <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>

                    <button class="icon-btn large" aria-label="Delete Note" data-tooltip="Delete note" data-delete-btn>
                        <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                        <div class="state-layer"></div>
                    </button>


                </div>

                <div class="state-layer"></div>
    `;

    tooltip($card.querySelector('[data-tooltip]'));

    /**note detail view & edit functionality 
     * 
     * attaches a click event listener to card element, 
     * when the card is clicked, it opens a modal with the note's details and allows for updating the note
     */
    // $card.addEventListener('click', function () {
    //     const /**{Object} */ modal = NoteModal(title, text, getRelativeTime(postedOn));
    //     modal.open();

    //     modal.onSubmit(function (noteData) {
    //         const updatedData = db.update.note(id, noteData);

    //         //update the note in the client UI
    //         client.note.update(id, updatedData);
    //         modal.close();
    //     });
    // });
    $card.addEventListener('click', function () {
        //  get latest note data
        const latestNote = db.get.note(notebookId)
            .find(note => note.id === id);

        const modal = NoteModal(
            latestNote.title,
            latestNote.text,
            getRelativeTime(latestNote.postedOn)
        );

        modal.open();

        modal.onSubmit(function (noteData) {
            const updatedData = db.update.note(id, noteData);

            // update UI immediately
            client.note.update(id, updatedData);

            modal.close();
        });
    });

    /**Delete note functionality
     * 
     * aattaches a click event listener to delete button element within card.
     * when the delete button is clicked, it opens a confirmation modal for deleting the associated note
     * if the deletion is confirmed, it updates the UI and database to remove the note
     * 
     */
    const /*{HTMLElement}*/ $deleteBtn = $card.querySelector('[data-delete-btn]');
    $deleteBtn.addEventListener('click', function (event) {
        event.stopImmediatePropagation();

        const /**{Object} */ modal = DeleteConfirmModal(title);
        modal.open();

        modal.onSubmit(function (isConfirm) {
            if (isConfirm) {
                const /**{Array} */ existedNotes = db.delete.note(notebookId, id);


                //update the client ui to reflect note deletion
                client.note.delete(id, existedNotes.length);
            }
            modal.close();
        });
    });

    return $card;
}