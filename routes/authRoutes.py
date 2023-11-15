from __main__ import app, render_template, request, \
    SQLAlchemy, os, UserMixin, flash, redirect, url_for, \
    generate_password_hash, check_password_hash, login_user, logout_user, LoginManager, login_required, db, session, \
    jsonify
from models.userModel import User
from models.lessonModel import Lesson
from models.studentModel import Student
from models.studentClassModel import StudentClass

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "De gebruiker moet ingelogd zijn om deze pagina te bekijken"


# Database model for the user

def setup_auth_routes(app):
    # This route will display the login view
    @app.route('/login')
    def login():
        return render_template("/auth/login.html")

    # Het inladen van de users
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # This route will display the sign up view
    @app.route('/signup')
    def signup():
        return render_template("/auth/signup.html")

    # This route will trigger the singup request
    @app.route('/signupReq', methods=['POST'])
    def signup_post():
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')
        studentnr = request.form.get('nummer')

        user = User.query.filter_by(email=email).first()

        if studentnr == '':
            if user:
                flash('Email is al in gebruik')
                return redirect(url_for('signup'))

            if name == '':
                flash('Vul alle velden in')
                return redirect(url_for('signup'))

            new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'), role=0,
                            studentNumber=None)
            db.session.add(new_user)
            db.session.commit()

        else:
            student = Student.query.filter_by(student_number=studentnr).first()
            if not student:
                flash('Studentnummer niet gevonden')
                return redirect(url_for('signup'))
            password = request.form.get("password")
            student.password = generate_password_hash(password, method='sha256')
            db.session.commit()

        return redirect(url_for('login'))

    # This route will trigger the login request
    @app.route('/loginReq', methods=['POST'])
    def login_post():
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            student = Student.query.filter_by(email=email).first()
            if not student or not check_password_hash(student.password, password):
                flash('Controleer uw inloggegevens en probeer het opnieuw.')
                return redirect(url_for('login'))
            else:
                login_user(student)
                session['user_id'] = student.id
                session['user_role'] = 1

                # retrieve the logged in student's associated lessons
                class_lessons = []
                for student_class in student.classes:
                    for lesson_class in student_class.classes.lessons:
                        lessons = Lesson.query.filter_by(id=lesson_class.lesson_id).all()
                        for lesson in lessons:
                            if lesson:
                                class_lessons.append({
                                    'id': lesson.id,
                                    'name': lesson.name,
                                    'date': lesson.date,
                                    'start_time': lesson.start_time,
                                    'end_time': lesson.end_time
                                })

                session['class_lessons'] = class_lessons
                return redirect(url_for('lessons_index'))

        else:
            login_user(user)
            session['user_id'] = user.id
            if user.role == 3:
                session['user_role'] = 3
            else:
                session['user_role'] = 2

            return redirect(url_for('index'))

    # Get user id of current logged in user
    @app.route('/user/user-id', methods=["GET"])
    def user_id():
        id = session['user_id']
        user = User.query.get(id)
        if not user:
            user = Student.query.filter_by(id=id).first()
            if not user:
                return jsonify({'message': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    # Het
    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))
