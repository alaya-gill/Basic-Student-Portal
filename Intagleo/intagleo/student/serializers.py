from rest_framework import serializers
from .models import Student,AllCourses,StudentCourses

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Student
        fields='__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model=AllCourses
        fields='__all__'

class StudentCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model=StudentCourses
        fields='__all__'