from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from __main__ import db, app, UserMixin

class Student(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=True)
    student_number = db.Column(db.Integer, nullable=True)

    classes = relationship('StudentClass', backref=db.backref('student_record', lazy=True, cascade='all, delete'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'student_number': self.student_number,
            'classes': [{'id': c.class_id,
                         'name': c.classes.name if c.classes else None
                         } for c in self.classes]
        }
