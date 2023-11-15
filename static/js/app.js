import Lesson from "./lesson.js";
import Student from "./student.js";
import Class_ from "./class.js";
import Teacher from "./teacher.js";
import Attendance from "./attendance.js";
import User from "./user.js";
import DeleteRowConfirmationModal from "./delete_row_confirmation_modal.js";

document.addEventListener("DOMContentLoaded", () => {
    new Lesson();
    new Attendance();
    new Student();
    new Class_();
    new Teacher();
    new User();
    new DeleteRowConfirmationModal();
})