export default class Attendance {
    constructor() {
        this.deleteFunction();
        this.insertAttendance();
        this.getAttendance();
        this.signOut();
    }

    deleteFunction() {
        if (document.querySelector("#attendance") != null) {
            // select all elements with the id "btnDelete"
            const deleteBtns = document.querySelectorAll("#btnDelete")

            // loop through each delete button
            deleteBtns.forEach((item) => {
                // add click event listener to each delete button
                item.addEventListener('click', (i) => {

                    // retrieve the unique id of the row to be deleted
                    const rowId = item.getAttribute('data-id')

                    // make a DELETE request to the server to delete the specified lesson
                    axios.delete('/attendances/' + rowId).then((response) => {
                        // reload the page after the lesson is successfully deleted
                        location.reload();
                    }, (error) => {
                        console.log(error);
                    });
                })
            })
        }
    }

    insertAttendance() {
        if (document.querySelector(".checkin-form") != null) {
            var socket = io.connect();
            var btnSubmit = document.getElementById("btnSubmit");
            btnSubmit.addEventListener("click", (i) => {
                var id = btnSubmit.getAttribute("data-id");
                var name = document.getElementById("inputName").value;
                var student_id = document.getElementById("inputStudentNumber").value;
                var question_answer = document.getElementById("inputQuestion");
                var mood = document.getElementById("selectMood").value;

                var question_answer_value = question_answer ? question_answer.value : 'None';

                const checkinData = {
                    uuid: id,
                    name: name,
                    student_id: student_id,
                    question_answer: question_answer_value,
                    mood: mood
                };
                socket.emit('check-in', checkinData);
            });
        }
    }

    countStudents() {
        // Update the count of attended students
        let attendedCountEl = document.getElementById('attended-count');
        let attendedCountText = attendedCountEl.innerText;
        let attendedCount = parseInt(attendedCountText.replace('Aantal aanwezig: ', '')) + 1;
        attendedCountEl.innerText = `Aantal aanwezig: ${attendedCount}`;
    }

    getAttendance() {
        if (document.querySelector("#attendance") != null) {
            var socket = io.connect();
            var uuid = document.querySelector("#attendance").getAttribute("data-id");
            var absentRows = document.querySelectorAll(".absent-table tbody tr");

            socket.on('attendance', function (data) {
                this.countStudents();
                if (data.uuid === uuid) {
                    console.log(data)
                    const table = document.querySelector(".table tbody");
                    const row = table.insertRow();
                    const cell1 = row.insertCell(0);
                    const cell2 = row.insertCell(1);
                    const cell3 = row.insertCell(2);
                    const cell4 = row.insertCell(3);
                    const cell5 = row.insertCell(4);
                    cell1.innerHTML = data.name;
                    cell2.innerHTML = data.checkin_time;
                    cell3.innerHTML = data.mood;
                    cell4.innerHTML = data.question_answer;
                    cell5.innerHTML = `<a href="/attendances/${data.uuid}" class="red" data-method="delete" data-confirm="Weet je het zeker?">Verwijderen</a>`;

                    // Remove the row with the absent student's ID
                    absentRows.forEach(function (row) {
                        if (row.getAttribute("data-id") === data.student_id) {
                            row.remove();
                        }
                    });
                }
            }.bind(this));
        }
    }

    signOut() {
        if (document.querySelector("#signoutBtn")) {
            const btnCommitSignout = document.querySelector("#btnCommitSignout");
            const signoutBtns = document.querySelectorAll("#signoutBtn");
            let lessonId = null;
            let studentId = null;
            let status = null;
            signoutBtns.forEach((item) => {
                item.addEventListener('click', (i) => {
                    lessonId = item.getAttribute('data-lesson-id');
                    studentId = item.getAttribute('data-student-id');
                })
            })
            btnCommitSignout.addEventListener('click', (i) => {
                const statusSelect = document.querySelector('select[name="status"]');
                status = statusSelect.value;
                i.preventDefault();
                const signoutData = {
                    lesson_id: lessonId,
                    student_id: studentId,
                    status: status
                };
                axios.post('/signout', signoutData).then((response) => {
                    console.log(response)
                    location.reload();
                }, (error) => {
                    console.log(error);
                });
            });
        }
    }
}