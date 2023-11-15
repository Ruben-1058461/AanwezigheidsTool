from __main__ import db, app
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    checkin_time = db.Column(DateTime, default=datetime.now, nullable=False)
    status = db.Column(db.String(100), nullable=False)
    mood = db.Column(db.String(100), nullable=True)
    question_answer = db.Column(db.String(200), nullable=True)

    student_id = db.Column(Integer, ForeignKey('user.id'), nullable=False)
    lesson_id = db.Column(db.String(255), ForeignKey('lesson.id'), nullable=False)

    lesson = relationship('Lesson', backref='attendance_list')

    def to_dict(self):
        lesson_obj = self.lesson.to_dict() if self.lesson else None
        return {
            'id': self.id,
            'checkin_time': self.checkin_time,
            'status': self.status,
            'mood': self.mood,
            'question_answer': self.question_answer,
            'student_id': self.student_id,
            'lesson': lesson_obj
        }