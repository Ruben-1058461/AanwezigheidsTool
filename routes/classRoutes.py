from flask import render_template, jsonify
from controllers.classController import ClassController


def setup_class_routes(app):
    # This route will redirect to the classes index route
    @app.route("/klassen_overzicht")
    def classes_index():
        classes = ClassController.get_all_classes()
        return render_template(
            "classes/index.html", classes=classes
        )

    @app.route('/classes/', methods=['POST'])
    def create_class():
        return ClassController.create_class()

    @app.route('/classes/<id>', methods=['GET'])
    def show_class(id):
        return ClassController.show_class(id)

    @app.route('/classes/<id>', methods=['POST'])
    def update_class(id):
        return ClassController.update_class(id)

    @app.route('/classes/<id>', methods=['DELETE'])
    def delete_class(id):
        return ClassController.delete_class(id)
        
    # Route to filter classes
    @app.route('/classes/filter/<input>', methods=['GET'])
    def filter_classes(input):
        return ClassController.filter_classes(input)
