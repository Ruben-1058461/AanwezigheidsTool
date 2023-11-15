from __main__ import SQLAlchemy, db
from sqlalchemy.orm import relationship
from models.classModel import Class

# Define the pivot table
class LessonClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'))
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))

    lesson = relationship('Lesson', backref=db.backref('lesson_classes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'lesson_id': self.lesson_id,
            'class_id': self.class_id
        }