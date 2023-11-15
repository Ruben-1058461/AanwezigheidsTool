from flask import render_template, jsonify
from controllers.teacherController import TeacherController


def setup_teacher_routes(app):
    # This route will redirect to the teachers index route
    @app.route("/docenten_overzicht")
    def teachers_index():
        teachers = TeacherController.get_all_teachers()
        return render_template(
            "teachers/index.html", teachers=teachers
        )

    @app.route('/teachers/', methods=['POST'])
    def create_teacher():
        return TeacherController.create_teacher()

    @app.route('/teachers/<id>', methods=['GET'])
    def show_teacher(id):
        return TeacherController.show_teacher(id)

    @app.route('/teachers/<id>', methods=['POST'])
    def update_teacher(id):
        return TeacherController.update_teacher(id)

    @app.route('/teacher/<id>', methods=['DELETE'])
    def delete_teacher(id):
        return TeacherController.delete_teacher(id)

    # Route to filter students
    @app.route('/teacher/filter/<input>', methods=['GET'])
    def filter_teachers(input):
        return TeacherController.filter_teacher(input)