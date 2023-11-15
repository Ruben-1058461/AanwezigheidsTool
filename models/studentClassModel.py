from __main__ import SQLAlchemy, db
from sqlalchemy.orm import relationship
from models.studentModel import Student

# Define the pivot table
class StudentClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))

    students = relationship('Student', backref=db.backref('students', lazy=True))
    classes = relationship('Class', backref=db.backref('students_classes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'class_id': self.class_id,
        }
