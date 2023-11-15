from flask import render_template, jsonify
from controllers.studentController import StudentController
from controllers.classController import ClassController
from models.attendanceModel import Attendance


def setup_student_routes(app):
    # This route will redirect to the students index route
    @app.route("/studenten_overzicht")
    def students_index():
        students = StudentController.get_all_students()
        classes = ClassController.get_all_classes()
        return render_template(
            "students/index.html", students=students, classes=classes
        )

    @app.route('/students/', methods=['POST'])
    def create_student():
        return StudentController.create_student()

    @app.route('/students/<id>', methods=['GET'])
    def show_student(id):
        return StudentController.show_student(id)

    @app.route('/students/<id>', methods=['POST'])
    def update_student(id):
        return StudentController.update_student(id)

    @app.route('/students/<id>', methods=['DELETE'])
    def delete_student(id):
        return StudentController.delete_student(id)
    
    @app.route('/students/<id>/aanwezigheid', methods=['GET'])
    def attendance_student(id):
        attendances = Attendance.query.filter(Attendance.student_id == id).all()
        attendance_dicts = [attendance.to_dict() for attendance in attendances]

        return render_template("/students/attendance/index.html", id=id, attendances=attendance_dicts)
    
    # Route to filter students
    @app.route('/students/filter/<input>', methods=['GET'])
    def filter_student(input):
        return StudentController.filter_student(input)
