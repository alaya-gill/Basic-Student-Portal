import re
from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator,RegexValidator
from django.db.models.expressions import F

# Create your models here.
class Student(models.Model):
    name=models.CharField(max_length=100,null=False, blank=False)
    roll_no_regex=RegexValidator(
        regex=r'^[0-9]{3,3}$',
        message="Number of length 3"
    )
    
    roll_no=models.CharField(validators=[roll_no_regex],max_length=3,unique=True,db_index=True,null=False, blank=False)
    email = models.EmailField(max_length=255, unique=True)
    phone_message = 'Phone number must be entered in the format: +923006860265' 

     # your desired format 
    phone_regex = RegexValidator(
        regex=r'^((\+92)|(0092))-{0,1}3{1}\d{2}-{0,1}\d{7}$|^0{0,1}3{1}\d{10}$|^0{0,1}3{1}\d{2}-\d{7}$',
        message=phone_message
    )

    # finally, your phone number field
    phone = models.CharField(validators=[phone_regex], max_length=14,
                             null=False, blank=False)
    address=models.CharField(max_length=300,null=False, blank=False)

class Courses(models.Model):
    name=name=models.CharField(max_length=200,null=False, blank=False)
    course_no=models.IntegerField(unique=True,db_index=True,null=False, blank=False)

class AllCourses(models.Model):
    roll_no_regex=RegexValidator(
        regex=r'^[0-9]{3,3}$',
        message="Number of length 3"
    )
    name=name=models.CharField(max_length=200,null=False, blank=False)
    course_no=models.CharField(validators=[roll_no_regex],max_length=3,unique=True,db_index=True,null=False, blank=False)
    
        
class StudentCourses(models.Model):
    def get_all(self):
        return self.course_no,self.name
    Student=models.ForeignKey(Student,on_delete=models.CASCADE,null=False,blank=False)
    Course=models.ForeignKey(AllCourses,on_delete=models.CASCADE,null=False,blank=False)
    marks_regex=RegexValidator(
        regex=r'^[0-9]{1,3}$',
        message="Number of length 3"
    )
    marks=models.CharField(validators=[marks_regex],max_length=3,null=True,blank=True)
    
