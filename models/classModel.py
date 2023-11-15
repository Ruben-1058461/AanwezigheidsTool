from __main__ import SQLAlchemy, db
from sqlalchemy.orm import relationship
from models.studentClassModel import StudentClass

# Define the Class model
class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Define the relationship to the StudentClass pivot table
    student_classes = db.relationship('StudentClass', backref=db.backref('student', lazy=True))
    lessons = db.relationship('LessonClass', backref=db.backref('classes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'students': [{'id': s.student_id,
                          'name': s.student.name
                          } for s in self.student_classes],
        }