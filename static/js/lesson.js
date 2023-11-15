export default class Lesson {
    constructor() {
        this.deleteFunction();
        this.getLessonInfo();
        this.removeLessonInfo()
        this.initializeDatePicker();
        this.filterLessons();
    }

    deleteFunction() {

        if (document.querySelector("#lessons") != null) {
            // select all elements with the id "btnDelete"
            const deleteBtns = document.querySelectorAll(".lessons #btnDelete")

            // loop through each delete button
            deleteBtns.forEach((item) => {
                // add click event listener to each delete button
                item.addEventListener('click', (i) => {
                    console.log('testjoidjsfo')
                    // retrieve the unique id of the row to be deleted
                    const rowId = item.getAttribute('data-id')

                    // make a DELETE request to the server to delete the specified lesson
                    axios.delete('/lessons/' + rowId).then((response) => {
                        // reload the page after the lesson is successfully deleted
                        location.reload();
                    }, (error) => {
                        console.log(error);
                    });
                })
            })
        }
    }

    getLessonInfo() {
        if (document.querySelector("#lessons") != null) {

            // Select all edit modal buttons
            const editModalBtns = document.querySelectorAll(".lessons #btnEdit");

            // Loop through each button
            editModalBtns.forEach((item) => {
                // Add click event listener to each button
                item.addEventListener("click", () => {
                    const rowId = item.getAttribute("data-id");
                    
                    // Make a GET request to retrieve the data for the selected lesson
                    axios.get("/lessons/" + rowId).then((response) => {
                        const lesson = response.data.lesson;
                        // check if the data is present in the response
                        if (lesson) {
                            // Get the modal element
                            const modal = document.getElementById("lessonModal");

                            // Update the form action to include the ID
                            document.querySelector("#lessonForm").action = `/lessons/${rowId}`;

                            // Get the form input elements
                            const nameInput = modal.querySelector("#inputName");
                            const questionTextarea = modal.querySelector("#textareaQuestion");
                            const dateInput = modal.querySelector("#inputDate");
                            const startTimeInput = modal.querySelector("#inputStartTime");
                            const endTimeInput = modal.querySelector("#inputEndTime");

                            // Set the value of the input elements to the values from the response data
                            nameInput.value = lesson.name;
                            questionTextarea.value = lesson.question;
                            dateInput.value = lesson.date;
                            startTimeInput.value = lesson.start_time;
                            endTimeInput.value = lesson.end_time;
                            lesson.classes.forEach((lesson) => {
                                document.querySelectorAll("#selectClasses option").forEach((el) => {
                                    if (lesson.id == el.value) {
                                        el.setAttribute('selected', 'selected');
                                    }
                                })
                            })
                        } else {
                            console.error("No data found in the response");
                        }
                    });
                });
            });
        }
    }

    removeLessonInfo() {
        if (document.querySelector("#lessons") != null) {

            const creatBtn = document.querySelector('.lessons #btnCreate')

            if (creatBtn != null) {
                creatBtn.addEventListener('click', () => {
                    // Get the modal element
                    const modal = document.getElementById("lessonModal");

                    // Get the form input elements
                    const nameInput = modal.querySelector("#inputName");
                    const questionTextarea = modal.querySelector("#textareaQuestion");
                    const dateInput = modal.querySelector("#inputDate");
                    const startTimeInput = modal.querySelector("#inputStartTime");
                    const endTimeInput = modal.querySelector("#inputEndTime");

                    // Set the value of the input elements to the values from the response data
                    nameInput.value = '';
                    questionTextarea.value = '';
                    dateInput.value = '';
                    startTimeInput.value = startTimeInput.options[0].value;
                    endTimeInput.value = endTimeInput.options[0].value;
                })
            }
        }
    }

    //Filter for lessons
    filterLessons() {
        //init datepicker for this filter
        const dateInputsFilter = document.querySelectorAll('.datepickerFilter');

        if (dateInputsFilter != null) {
            dateInputsFilter.forEach((input) => {
                const picker = new Pikaday({
                    field: input,
                    format: 'YYYY-MM-DD HH:mm:ss',
                    onSelect: function (field) {
                        field.value = this.getMoment().format('YYYY-MM-DD HH:mm:ss');
                        filterLessons();
                    }
                });
            });
        }

        if (document.querySelector("#lessons") != null) {
            const filterInput = document.querySelector("#filterAccordion input");

            var filterLessons = function () {
                //get filter input
                var name = document.getElementById("filterName").value;
                var startDate = document.getElementById("filterStartDate").value;
                var endDate = document.getElementById("filterEndDate").value;
                
                //check if inputs are empty
                if (name == "") {
                    name = null;
                }
                
                if (startDate == "") {
                    startDate = null;
                }
                
                if (endDate == "") {
                    endDate = null;
                }

                //send request with axios
                axios.get(`/lessons/filter/${name}/${startDate}/${endDate}`).then((response) => {
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
                            let classes = results[i].classes;
                            let name = results[i].name;
                            let question = results[i].question;
                            let date = results[i].date;
                            let start_time = results[i].start_time;
                            let end_time = results[i].end_time;
                            let user_role = results[i].user_role;

                            output += `<td>${name}</td>`;
                            output += `<td>${question}</td>`;
                            output += "<td>";
                            for (i in classes) {
                                output += classes[i].name;
                                if (i < classes.length - 1) {
                                    output += ", ";
                                }
                            }
                            output += "</td>";
                            output += `<td>${date}</td>`;
                            output += `<td>${start_time}</td>`;
                            output += `<td>${end_time}</td>`;
                            if (user_role > 1) {
                                output += `<td><a href="/check-in/${id}" class="blue">QR-code</a></td>`;
                                output += `<td><a href="/lessons/${id}/aanwezigheid" class="blue">Aanwezigheid</a></td>`;
                                output += `<td><a href="#" class="red" data-id="${id}" id="btnDelete">Verwijderen</a></td>`;
                                output += `<td><a href="#" class="blue" data-id="${id}" id="btnEdit" data-toggle="modal" data-target="#lessonModalUpdate">Wijzigen</a></td>`;
                                output += "</tr>";
                            }
                        }

                        el.innerHTML = output;
                    } else {
                        console.error("No data found in the response");
                    }
                });
            }

            //Event listeners
            if (filterInput != null) {
                filterInput.addEventListener('keyup', filterLessons, false);
                filterInput.addEventListener('change', filterLessons, false);
            }
        }
    }

    initializeDatePicker() {
        if (document.querySelector("#lessons") != null) {
            const dateInputs = document.querySelectorAll('.datepicker');

            if (dateInputs != null) {
                dateInputs.forEach((input) => {
                    const picker = new Pikaday({
                        field: input,
                        format: 'YYYY-MM-DD HH:mm:ss',
                        minDate: new Date(),
                        onSelect: function (field) {
                            field.value = this.getMoment().format('YYYY-MM-DD HH:mm:ss');
                            console.log(input.value = this.toString());
                        }
                    });
                });
            }
        }
    }
}

