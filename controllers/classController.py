from __main__ import jsonify, db, request, render_template, redirect, url_for, flash
from models.classModel import Class


class ClassController():

    @staticmethod
    def get_all_classes():
        classes = Class.query.all()
        class_dict = [class_.to_dict() for class_ in classes]
        return class_dict

    @staticmethod
    def show_class(id):
        class_ = Class.query.get(id)
        if not class_:
            return jsonify({'message': 'Class not found'}), 404
        return jsonify({'class': class_.to_dict()}), 200

    @staticmethod
    def create_class():
        name = request.form.get('name')

        new_class = Class(name=name)

        if Class.query.filter((Class.name == name)).first() is not None:
            flash("Error: Deze klas bestaat al.")
            return redirect(url_for('students_index'))

        db.session.add(new_class)
        db.session.commit()

        return redirect(url_for('classes_index'))

    @staticmethod
    def update_class(id):
        class_ = Class.query.get(id)
        if not class_:
            return jsonify({'message': 'Class not found'}), 404

        name = request.form.get('name')

        class_.name = name

        db.session.commit()

        return redirect(url_for('classes_index'))

    @staticmethod
    def delete_class(id):
        class_ = Class.query.get(id)
        if not class_:
            return jsonify({'message': 'Class not found'}), 404
        db.session.delete(class_)
        db.session.commit()
        return '', 204

    @staticmethod
    def filter_classes(input):
        if input != "null":
            search = "%{}%".format(input)

            results = Class.query.filter(Class.name.like(search))
        else:
            results = Class.query.all()

        if not results:
            return jsonify({'message': 'No results'}), 404
        results_dict = [result.to_dict() for result in results]
        return results_dict