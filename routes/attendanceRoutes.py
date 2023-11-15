from __main__ import Flask, send_file, render_template, request, app, SocketIO, emit
from flask_qrcode import QRcode
import datetime
from models.lessonModel import Lesson
from models.classModel import Class
from models.studentModel import Student
from models.attendanceModel import Attendance
from controllers.attendanceController import AttendanceController

qrcode = QRcode(app)


def setup_qr_routes(app):

    @app.route("/signout", methods=['POST'])
    def commitSignOut():
        return AttendanceController.signout()

    @app.route("/check-in/<id>")
    def checkIn(id):
        return render_template("lessons/checkin/qrcode.html", id=id)

    @app.route("/check-in/form/<id>")
    def checkInForm(id):
        lesson = Lesson.query.filter_by(id=id).first()
        if not lesson:
            return "Lesson not found"
        return render_template("lessons/checkin/form.html", id=id, lesson=lesson)

    @app.route("/checkin-in/", methods=['POST'])
    def create_attendance():
        return AttendanceController.create_attendance()

    @app.route("/attendances/<id>", methods=['DELETE'])
    def delete_attendance(id):
        return AttendanceController.delete_attendance(id)

    @app.route('/lesson/<id>/aanwezigheid', methods=['GET'])
    def attendance_lesson(id):
        # Start Flask-SocketIO only when this route is accessed
        socketio = SocketIO(app)

        @socketio.on('check-in')
        def handle_attendance(data):
            uuid = data['uuid']
            name = data['name']
            student_id = data['student_id']
            checkin_time = datetime.datetime.now().strftime('%H:%M:%S')
            question_answer = data['question_answer']
            mood = data['mood']
            emit('attendance', {'student_id': student_id,
                                'name': name,
                                'checkin_time': checkin_time,
                                'question_answer': question_answer,
                                'mood': mood,
                                'uuid': uuid}, broadcast=True)

        # Query the lesson and get its associated students
        lesson = Lesson.query.filter_by(id=id).first()
        students = []
        for lesson_class in lesson.lesson_classes:
            class_objs = Class.query.filter_by(id=lesson_class.class_id).all()
            for class_obj in class_objs:
                for student_class in class_obj.student_classes:
                    student = Student.query.filter_by(id=student_class.student_id).first()
                    students.append(student)

        # Query the attendance records for the lesson
        attendances = Attendance.query.filter_by(lesson_id=id).all()

        # Create two lists: one for attended students and one for absent students
        attended_students = []
        absent_students = []
        for attendance in attendances:
            student = Student.query.filter_by(student_number=attendance.student_id).first()
            if student:
                attended_students.append({
                    'id': student.student_number,
                    'name': student.name,
                    'checkin_time': attendance.checkin_time,
                    'question_answer': attendance.question_answer,
                    'mood': attendance.mood
                })

        for student in students:
            if student.student_number not in [a['id'] for a in attended_students]:
                absent_students.append({
                    'id': student.student_number,
                    'name': student.name
                })

        # Render the template with both lists
        return render_template("/lessons/attendance/index.html", id=id, attendances=attendances,
                               attended_students=attended_students, absent_students=absent_students, lesson=lesson)
