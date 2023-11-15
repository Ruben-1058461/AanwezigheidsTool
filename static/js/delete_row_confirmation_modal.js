export default class DeleteRowConfirmationModal {
    constructor() {
        this.DeleteRowConfirmationModal();
    }

    DeleteRowConfirmationModal() {
        if (document.querySelectorAll("#deleteRowConfirmation").length > 0) {
            // select all elements with the id "btnDelete"
            const deleteBtns = document.querySelectorAll(".showDeleteRowModal");

            // loop through each delete button
            deleteBtns.forEach((item) => {
                // add click event listener to each delete button
                item.addEventListener('click', (i) => {
                    // retrieve the unique id of the row to be deleted
                    const rowId = item.getAttribute('data-id');

                    document.getElementById("btnDelete").setAttribute('data-id', rowId);
                })
            })
        }
    }
}