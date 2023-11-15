from __main__ import SQLAlchemy, db, app, UserMixin

# Define the Lesson model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=True)
    role = db.Column(db.Integer, nullable=False)
    studentNumber = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'role': self.role,
            'student_number': self.studentNumber
        }