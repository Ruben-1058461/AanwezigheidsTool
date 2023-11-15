from __main__ import jsonify, db, request, render_template, redirect, url_for, uuid, flash
from models.userModel import User


class TeacherController():

    @staticmethod
    def get_all_teachers():
        teachers = User.query.filter_by(role=2)
        teachers_dict = [teacher.to_dict() for teacher in teachers]
        return teachers_dict

    @staticmethod
    def show_teacher(id):
        teacher = User.query.get(id)
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404
        return jsonify({'teacher': teacher.to_dict()}), 200

    @staticmethod
    def create_teacher():
        name = request.json.get('name')
        email = request.json.get('email')
        teacher_id = str(uuid.uuid4())

        existing_student =  User.query.filter((User.email == email)).first()
        if existing_student is not None:
            return jsonify({'message': 'Error: Een docent met deze email bestaat al.'})

        new_teacher = User(id=teacher_id, name=name, email=email, role=2)

        db.session.add(new_teacher)
        db.session.commit()

        return jsonify({'message' : 'success'})

    @staticmethod
    def update_teacher(id):
        teacher = User.query.get(id)
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404

        existing_student =  User.query.filter((User.email == email)).filter(User.id != id).first()
        if existing_student is not None:
            return jsonify({'message': 'Error: Een docent met deze email bestaat al.'})

        name = request.json.get('name')
        email = request.json.get('email')

        teacher.name = name
        teacher.email = email

        db.session.commit()

        return jsonify({'message': 'success'})

    @staticmethod
    def delete_teacher(id):
        teacher = User.query.get(id)
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404
        db.session.delete(teacher)
        db.session.commit()
        return '', 204
    
    @staticmethod
    def filter_teacher(input):
        if input != "null":
            search = "%{}%".format(input)

            results = User.query.filter_by(role=0).filter(User.name.like(search))
        else:
            results = User.query.filter_by(role=0)

        if not results:
            return jsonify({'message': 'No results'}), 404
        results_dict = [result.to_dict() for result in results]
        return results_dict


def teacherController():
    return None