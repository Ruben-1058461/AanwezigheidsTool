from models.studentModel import Student
from models.studentClassModel import StudentClass
from models.classModel import Class
from __main__ import db, app
from faker import Faker
import random

fake = Faker()

# Create a list of class IDs to select from (1 to 4)
class_ids = [1, 2, 3, 4]

# Generate 50 random student records
for i in range(50):
    # Create a new student
    new_student = Student(
        name=fake.name(),
        email=fake.email(),
        password=fake.password(),
        student_number=random.randint(1000, 9999)
    )

    # Add the new student to the database
    db.session.add(new_student)

    # Commit the changes to the database so that we can access the new student's ID
    db.session.commit()

    # Select a random class ID
    class_id = random.choice(class_ids)

    # Create a new StudentClass object and add it to the database
    student_class = StudentClass(student_id=new_student.id, class_id=class_id)
    db.session.add(student_class)

# Commit the changes to the database
db.session.commit()