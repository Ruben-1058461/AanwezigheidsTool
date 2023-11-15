export default class Class_ {
    constructor() {
        this.deleteFunction();
        this.getClassInfo();
        this.removeClassInfo();
        this.filterClasses();
    }

    deleteFunction() {
        if (document.querySelector("#classes") != null) {
            // select all elements with the id "btnDelete"
            const deleteBtns = document.querySelectorAll("#btnDelete")

            // loop through each delete button
            deleteBtns.forEach((item) => {
                // add click event listener to each delete button
                item.addEventListener('click', (i) => {
                    // retrieve the unique id of the row to be deleted
                    const rowId = item.getAttribute('data-id')

                    // make a DELETE request to the server to delete the specified class
                    axios.delete('/classes/' + rowId).then((response) => {
                        // reload the page after the class is successfully deleted
                        location.reload();
                    }, (error) => {
                        console.log(error);
                    });
                })
            })
        }
    }

    getClassInfo() {
        if (document.querySelector("#classes") != null) {
            // Select all edit modal buttons
            const editModalBtns = document.querySelectorAll("#btnEdit");

            // Loop through each button
            editModalBtns.forEach((item) => {
                // Add click event listener to each button
                item.addEventListener("click", () => {
                    const rowId = item.getAttribute("data-id");
                    console.log(rowId)
                    // Make a GET request to retrieve the data for the selected class
                    axios.get("/classes/" + rowId).then((response) => {
                        const class_ = response.data.class;
                        // check if the data is present in the response
                        if (class_) {
                            // Get the modal element
                            const modal = document.getElementById("classModal");

                            // Update the form action to include the ID
                            document.querySelector("#classForm").action = `/classes/${rowId}`;

                            // Get the form input elements
                            const nameInput = modal.querySelector("#inputName");

                            // Set the value of the input elements to the values from the response data
                            nameInput.value = class_.name;
                            dateInput.value = class_.date;
                        } else {
                            console.error("No data found in the response");
                        }
                    });
                });
            });
        }
    }

    removeClassInfo() {
        if (document.querySelector("#classes") != null) {
            const creatBtn = document.querySelector('#btnCreate')

            if (creatBtn != null) {
                creatBtn.addEventListener('click', () => {
                    console.log('terst')
                    // Get the modal element
                    const modal = document.getElementById("classModal");

                    // Get the form input elements
                    const nameInput = modal.querySelector("#inputName");

                    // Set the value of the input elements to the values from the response data
                    nameInput.value = '';
                })
            }
        }
    }

    //Filter for classes
    filterClasses() {
        if (document.querySelector("#classes") != null) {
            const filterInput = document.querySelector("#filterAccordion input");

            var filterClasses = function () {
                //get filter input
                var input = document.getElementById("filterName").value;
                
                if (input == "") {
                    input = null;
                }

                //send request with axios
                axios.get("/classes/filter/" + input).then((response) => {
                    const results = response.data;
                    // check if the data is present in the response
                    if (results) {
                        // Get the element
                        let el = document.querySelector(".table tbody");

                        //Create empty output var
                        let output = "";

                        //Show results in table
                        for (let i in results) {
                            output += "<tr>";
                                let id = results[i].id;
                                let name = results[i].name;

                                output += `<td>${name}</td>`;
                                output += `<td><a href="#" class="red" data-id="${id}" id="btnDelete">Verwijderen</a></td>`;
                                output += `<td><a href="#" class="blue" data-id="${id}" id="btnEdit" data-toggle="modal" data-target="#classesModalUpdate">Wijzigen</a></td>`;
                            output += "</tr>";
                        }

                        el.innerHTML = output;
                    } else {
                        console.error("No data found in the response");
                    }
                });
            }

            //Event listeners
            if (filterInput != null) {
                filterInput.addEventListener('keyup', filterClasses, false);
                filterInput.addEventListener('change', filterClasses, false);
            }
        }
    }
}

