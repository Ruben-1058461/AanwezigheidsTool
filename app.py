from flask import Flask, redirect, url_for, request, flash, render_template, jsonify, send_from_directory, send_file, session
import os.path, uuid
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask_socketio import SocketIO, emit


LISTEN_ALL = "0.0.0.0"
FLASK_IP = LISTEN_ALL
FLASK_PORT = 81
FLASK_DEBUG = True

app = Flask(__name__)

# Add custom MIME type for JavaScript files, so we can use the import function
@app.route('/static/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path, mimetype='application/javascript')


# This command creates the "<application directory>/databases/hogeschool_rotterdam.db" path
db = SQLAlchemy()
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(app.root_path, 'databases', 'hogeschool_rotterdam.db')
db.init_app(app)


# import declared routes
import routes.authRoutes
import routes.lessonRoutes
import routes.attendanceRoutes
import routes.teacherRoutes
import routes.studentRoutes
import routes.classRoutes
routes.studentRoutes.setup_student_routes(app)
routes.lessonRoutes.setup_lesson_routes(app)
routes.attendanceRoutes.setup_qr_routes(app)
routes.authRoutes.setup_auth_routes(app)
routes.teacherRoutes.setup_teacher_routes(app)
routes.classRoutes.setup_class_routes(app)

# Secret key for the session
app.secret_key = '1335eb3948fb7b64a029aa29'

# This route will redirect to the login route
@app.route("/")
def start():
    return redirect(url_for('login'))

# This route will redirect to the login route
@app.route("/index")
def index():
    return render_template(
        "index.html"
    )

if __name__ == "__main__":
    app.run(host=FLASK_IP, port=FLASK_PORT, debug=FLASK_DEBUG)
