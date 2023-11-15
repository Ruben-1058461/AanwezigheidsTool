export default class Student {
    constructor() {
        this.deleteFunction();
        this.getStudentInfo();
        this.removeStudentInfo();
        this.removeStudentInfo();
        this.filterStudent();
        this.createStudent();
        this.updateStudent();
    }

    deleteFunction() {
        if (document.querySelector("#students") != null) {
            // select all elements with the id "btnDelete"
            const deleteBtns = document.querySelectorAll(".students #btnDelete")

            // loop through each delete button
            deleteBtns.forEach((item) => {
                // add click event listener to each delete button
                item.addEventListener('click', (i) => {
                    // retrieve the unique id of the row to be deleted
                    const rowId = item.getAttribute('data-id')

                    // make a DELETE request to the server to delete the specified student
                    axios.delete('/students/' + rowId).then((response) => {
                        // reload the page after the student is successfully deleted
                        location.reload();
                    }, (error) => {
                        console.log(error);
                    });
                })
            })
        }
    }

    getStudentInfo() {
        if (document.querySelector("#students") != null) {
            // Select all edit modal buttons
            const editModalBtns = document.querySelectorAll(".students #btnEdit");

            // Loop through each button
            editModalBtns.forEach((item) => {
                // Add click event listener to each button
                item.addEventListener("click", () => {
                    const rowId = item.getAttribute("data-id");

                    // Make a GET request to retrieve the data for the selected student
                    axios.get("/students/" + rowId).then((response) => {
                        const student = response.data.student;
                        // check if the data is present in the response
                        if (student) {
                            // Get the modal element
                            const modal = document.getElementById("studentModalUpdate");

                            // Update the form action to include the ID
                            document.querySelector("#studentModalUpdate #studentForm").action = `/students/${rowId}`;
                            // Get the form input elements
                            const nameInput = modal.querySelector("#inputName");
                            const emailInput = modal.querySelector("#inputEmail");
                            const studentNumberInput = modal.querySelector("#inputStudentNumber");
                            const errorMessage = modal.querySelector(".error");

                            // Set the value of the input elements to the values from the response data
                            nameInput.value = student.name;
                            emailInput.value = student.email;
                            studentNumberInput.value = student.student_number;
                            student.classes.forEach((student) => {
                                document.querySelectorAll("#selectClasses option").forEach((el) => {
                                    if (student.id == el.value) {
                                        el.setAttribute('selected', 'selected');
                                    }
                                })
                            })
                            errorMessage.innerHTML = "";
                        } else {
                            console.error("No data found in the response");
                        }
                    });
                });
            });
        }
    }

    removeStudentInfo() {
        if (document.querySelector("#students") != null) {
            const creatBtn = document.querySelector('.students #btnCreate')

            if (creatBtn != null) {
                creatBtn.addEventListener('click', () => {
                    // Get the modal element
                    const modal = document.getElementById("studentModal");

                    // Get the form input elements
                    const nameInput = modal.querySelector("#inputName");
                    const emailInput = modal.querySelector("#inputEmail");
                    const studentNumberInput = modal.querySelector("#inputStudentNumber");
                    const errorMessage = modal.querySelector(".error");

                    // Set the value of the input elements to the values from the response data
                    nameInput.value = '';
                    emailInput.value = '';
                    studentNumberInput.value = '';
                    errorMessage.innerHTML = '';
                })
            }
        }
    }

    //Filter for students
    filterStudent() {
        if (document.querySelector("#students") != null) {
            const filterInput = document.querySelector("#filterAccordion input");

            var filterStudent = function () {
                //get filter input
                var input = document.getElementById("filterName").value;

                if (input == "") {
                    input = null;
                }

                //send request with axios
                axios.get("/students/filter/" + input).then((response) => {
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
                            let email = results[i].email;
                            let studentNumber = results[i].student_number;
                            let classes = results[i].classes;

                            output += `<td>${name}</td>`;
                            output += `<td>${email}</td>`;
                            output += `<td>${studentNumber}</td>`;
                            output += "<td>";
                            for (i in classes) {
                                output += classes[i].name;
                                if (i < classes.length - 1) {
                                    output += ", ";
                                }
                            }
                            output += "</td>";
                            output += `<td><a href="#" class="red" data-id="${id}" id="btnDelete">Verwijderen</a></td>`;
                            output += `<td><a href="#" class="blue" data-id="${id}" id="btnEdit" data-toggle="modal" data-target="#studentModalUpdate">Wijzigen</a></td>`;
                            output += `<td><a href="/students/${studentNumber}/aanwezigheid" class="blue">Aanwezigheid</a></td>`;
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
                filterInput.addEventListener('keyup', filterStudent, false);
                filterInput.addEventListener('change', filterStudent, false);
            }
        }
    }

    createStudent() {
        if (document.getElementById("studentModalCreate") != null) {
            const creatBtn = document.querySelector('#saveBtn');
            creatBtn.addEventListener('click', () => {
                // Get the modal element
                const modal = document.getElementById("studentModalCreate");

                // Get the form input elements
                const nameInput = modal.querySelector("#inputName").value;
                const emailInput = modal.querySelector("#inputEmail").value;
                const studentNumberInput = modal.querySelector("#inputStudentNumber").value;
                const selectEl = modal.querySelector("#selectClasses");
                const selectedClasses = Array.from(selectEl.options).filter(option => option.selected).map(option => option.value);
                let error = 0;

                if (nameInput == '' || emailInput == '' || studentNumberInput == '') {
                    error++;
                }

                if (emailInput.indexOf("@") == -1 || emailInput.indexOf(".") == -1) {
                    error++;
                }

                if (error == 0) {
                    axios.post('/students/', {
                        name: nameInput,
                        email: emailInput,
                        student_number: studentNumberInput,
                        selected_classes: selectedClasses
                    })
                        .then((response) => {
                            const result = response.data;
                            if (result) {
                                if (result.message == 'Error: Dit studentnummer of email bestaat al.') {
                                    let output = '<div class="alert alert-danger" role="alert">Error: Dit studentnummer of email bestaat al.</div>';
                                    document.querySelector('.error').innerHTML = output;
                                } else {
                                    location.reload();
                                }
                            }
                        })
                } else {
                    let output = '<div class="alert alert-danger" role="alert">Error: Zorg dat je alle velden goed invult.</div>';
                    document.querySelector('.error').innerHTML = output;
                }
            })
        }
    }

    updateStudent() {
        if (document.getElementById("studentModalUpdate") != null) {
            const creatBtn = document.querySelector('#studentModalUpdate #saveBtn');
            creatBtn.addEventListener('click', () => {
                // Get the modal element
                const modal = document.getElementById("studentModalUpdate");

                // Get the form element
                const studentForm = document.querySelector("#studentModalUpdate #studentForm");

                // Get the ID from the form action attribute
                const rowId = studentForm.getAttribute("action").split("/")[2];

                // Get the form input elements
                const nameInput = modal.querySelector("#inputName").value;
                const emailInput = modal.querySelector("#inputEmail").value;
                const studentNumberInput = modal.querySelector("#inputStudentNumber").value;
                const selectEl = modal.querySelector("#selectClasses");
                const selectedClasses = Array.from(selectEl.options).filter(option => option.selected).map(option => option.value);
                let error = 0;

                if (nameInput == '' || emailInput == '' || studentNumberInput == '') {
                    error++;
                }

                if (emailInput.indexOf("@") == -1 || emailInput.indexOf(".") == -1) {
                    error++;
                }

                if (error == 0) {
                    axios.post('/students/' + rowId, {
                        name: nameInput,
                        email: emailInput,
                        student_number: studentNumberInput,
                        selected_classes: selectedClasses
                    })
                        .then((response) => {
                            const result = response.data;
                            if (result) {
                                if (result.message == 'Error: Dit studentnummer of email bestaat al.') {
                                    let output = '<div class="alert alert-danger" role="alert">Error: Dit studentnummer of email bestaat al.</div>';
                                    document.querySelector('#studentModalUpdate .error').innerHTML = output;
                                } else {
                                    location.reload();
                                }
                            }
                        })
                } else {
                    let output = '<div class="alert alert-danger" role="alert">Error: Zorg dat je alle velden goed invult.</div>';
                    document.querySelector('.error').innerHTML = output;
                }
            })
        }
    }
}

