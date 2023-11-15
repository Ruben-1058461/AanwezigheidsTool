from __main__ import jsonify, db, request, render_template, redirect, url_for, uuid, flash, session
from models.lessonModel import Lesson
from models.lessonClassModel import LessonClass


class LessonController():

    @staticmethod
    def get_all_lessons():
        lessons = Lesson.query.all()
        lessons_dict = [lesson.to_dict() for lesson in lessons]
        return lessons_dict

    @staticmethod
    def show_lesson(id):
        lesson = Lesson.query.get(id)
        if not lesson:
            return jsonify({'message': 'Lesson not found'}), 404
        return jsonify({'lesson': lesson.to_dict()}), 200

    @staticmethod
    def create_lesson():
        lesson_id = str(uuid.uuid4())
        name = request.form.get('name')
        question = request.form.get('question')
        date = request.form.get('date')
        start_time = request.form.get('start_time')
        end_time = request.form.get('end_time')

        # Get a list of the selected class IDs from the form data
        selected_classes = request.form.getlist('classes')
        print(selected_classes)
        new_lesson = Lesson(id=lesson_id, name=name, question=question, date=date, start_time=start_time,
                            end_time=end_time)

        if Lesson.query.filter((Lesson.name == name)).first() is not None:
            flash("Error: Deze les bestaat al.")
            return redirect(url_for('lessons_index'))

        db.session.add(new_lesson)
        db.session.commit()

        # Create StudentClass objects for the selected classes and add them to the pivot table
        for class_id in selected_classes:
            lesson_class = LessonClass(lesson_id=new_lesson.id, class_id=class_id)
            db.session.add(lesson_class)
            db.session.commit()
        return redirect(url_for('lessons_index'))

    @staticmethod
    def update_lesson(id):
        lesson = Lesson.query.get(id)
        if not lesson:
            return jsonify({'message': 'Lesson not found'}), 404

        name = request.form.get('name')
        question = request.form.get('question')
        date = request.form.get('date')
        start_time = request.form.get('start_time')
        end_time = request.form.get('end_time')

        # Get a list of the selected class IDs from the form data
        selected_classes = request.form.getlist('classes')

        lesson.name = name
        lesson.question = question
        lesson.date = date
        lesson.start_time = start_time
        lesson.end_time = end_time

        # Remove any existing LessonClass objects for this lesson
        lesson.lesson_classes = []

        # Create LessonClass objects for the selected classes and add them to the pivot table
        for class_id in selected_classes:
            lesson_class = LessonClass(lesson_id=lesson.id, class_id=class_id)
            db.session.add(lesson_class)

        db.session.commit()

        return redirect(url_for('lessons_index'))

    @staticmethod
    def delete_lesson(id):
        lesson = Lesson.query.get(id)
        print(lesson)
        if not lesson:
            return jsonify({'message': 'Lesson not found'}), 404
        db.session.delete(lesson)
        db.session.commit()
        return '', 204

    @staticmethod
    def filter_lessons(name, startDate, endDate):
        if name != "null" or startDate != "null" or endDate != "null":
            if name == "null":
                name = ""

            searchName = f"%{name}%"
            startDate = startDate.replace("%20", " ")
            endDate = endDate.replace("%20", " ")

            if startDate != "null" and endDate != "null":
                results = Lesson.query.filter(Lesson.name.like(searchName)).filter(
                    Lesson.date.between(startDate, endDate))
            elif startDate != "null":
                results = Lesson.query.filter(Lesson.name.like(searchName)).filter(Lesson.date >= startDate)
            elif endDate != "null":
                results = Lesson.query.filter(Lesson.name.like(searchName)).filter(Lesson.date <= endDate)
            else:
                results = Lesson.query.filter(Lesson.name.like(searchName))
        else:
            results = Lesson.query.all()

        if not results:
            return jsonify({'message': 'No results'}), 404
        results_dict = [result.to_dict() for result in results]
        for result in results_dict:
            result["user_role"] = session["user_role"]
        return results_dict
