from re import S
import re
from django.shortcuts import render
from rest_framework import generics, status, views
from .serializers import StudentSerializer,CourseSerializer,StudentCoursesSerializer
from rest_framework.response import Response
from .models import Student,AllCourses,StudentCourses
from .calculator import gpa,cgpa

class AddStudent(generics.GenericAPIView):
    serializer_class=StudentSerializer
    def post(self,request):
        print(request.data)
        stud=request.data
        serializer = self.serializer_class(data=stud)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(str(e)+" Try a New One.", status=status.HTTP_401_UNAUTHORIZED)
        serializer.save()
        return Response({'success': True, 'message': 'Registered'}, status=status.HTTP_200_OK)
    def get(self,request):
        stud=Student.objects.all()
        return Response({'students': stud.values(),"status":"200"}, status=status.HTTP_200_OK)

    
class UpdateDeleteStudent(generics.GenericAPIView):
    serializer_class=StudentSerializer
    def get(self,request,*args, **kwargs):
        id=self.kwargs.get('roll')
        user=""
        try:
            user=Student.objects.get(roll_no=id)
        except:
            return Response({"error":"No such Student","status":"401"},status=status.HTTP_401_UNAUTHORIZED)
        student_courses=StudentCourses.objects.filter(Student=user)
        dic=dict()
        records=[]
        for sc in student_courses.all():
            records.append(
            {
            "id": sc.id,
            "Student_id": sc.Student_id,
            "Course_id": sc.Course_id,
            "Course_name":sc.Course.name,
            "Course_no":sc.Course.course_no,
            "marks": sc.marks
            })
            print(sc.Course.name)
        
        if student_courses:
            return Response({'info': StudentSerializer(user).data,'courses':records,"status":"200"}, status=status.HTTP_200_OK)
        return Response({'info': StudentSerializer(user).data,'courses':"no courses found","status":"200"}, status=status.HTTP_200_OK)
    
    def put(self,request,*args, **kwargs):
        id=self.kwargs.get('roll')
        user=""
        try:
            user=Student.objects.get(roll_no=id)
        except:
            return Response({"error":"No projects for such User","status":"401"},status=status.HTTP_401_UNAUTHORIZED)
        serializer = StudentSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            stud=Student.objects.all()
            return Response({stud.values()}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,*args, **kwargs):
        id=self.kwargs.get('roll')
        print(id)
        user=Student.objects.filter(roll_no=id)
        user.delete()
        return Response({'msg': "Record deleted","status":"200"}, status=status.HTTP_200_OK)
    
class Course(generics.GenericAPIView):
    serializer_class=CourseSerializer
    def get(self,request):
        stud=AllCourses.objects.all()
        return Response({'courses': stud.values(),"status":"200"}, status=status.HTTP_200_OK)
    def post(self,request):
        stud=request.data
        serializer = self.serializer_class(data=stud)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(str(e)+" Try a New One.", status=status.HTTP_401_UNAUTHORIZED)
        serializer.save()
        return Response({'success': True, 'message': 'Added'}, status=status.HTTP_200_OK)

class StudentCoursesAdd(generics.GenericAPIView):
    serializer_class=StudentCoursesSerializer
    def get(self,request,*args, **kwargs):
        roll=self.kwargs.get('roll')
        user=Student.objects.get(roll_no=roll)
        student_courses=StudentCourses.objects.filter(Student=user)
        dic=dict()
        records=[]
        for sc in student_courses.all():
            records.append(
            {
            "id": sc.id,
            "Student_id": sc.Student_id,
            "Course_id": sc.Course_id,
            "Course_name":sc.Course.name,
            "Course_no":sc.Course.course_no,
            "marks": sc.marks
            })
            print(sc.Course.name)
        
        if student_courses:
            return Response({'info': StudentSerializer(user).data,'courses':records,"status":"200"}, status=status.HTTP_200_OK)
        return Response({'info': StudentSerializer(user).data,'courses':"no courses found","status":"200"}, status=status.HTTP_200_OK)

        #return Response({'success': True, 'message': 'No courses Yet'}, status=status.HTTP_200_OK)
    
    def post(self,request,*args, **kwargs):
        print(self.request.data)
        #serializer = self.get_serializer(data=self.request.data)
        marks=self.request.data['marks']
        roll=self.kwargs.get('roll')
        #course_no=self.request.data['Course']
        course_no=self.kwargs.get('course')
        print(course_no,marks)
        # stud_instance = Student.objects.filter(roll_no=roll).first()
        # course_instance = AllCourses.objects.filter(id=course_no).first()
        # print(course_instance.name)
        user,course="",""
        user=Student.objects.get(roll_no=roll)
        
        course=AllCourses.objects.get(course_no=course_no)
        print(user.name,course.name)
        p=StudentCourses.objects.filter(Student=user,Course=course)
        if p.count()>0:
            return Response({'msg': "Course already added"}, status=status.HTTP_401_UNAUTHORIZED)
        StudentCourses.objects.create(Student=user,Course=course,marks=marks)
        student_courses=StudentCourses.objects.filter(Student=user)
        dic=dict()
        records=[]
        for sc in student_courses.all():
            records.append(
            {
            "id": sc.id,
            "Student_id": sc.Student_id,
            "Course_id": sc.Course_id,
            "Course_name":sc.Course.name,
            "Course_no":sc.Course.course_no,
            "marks": sc.marks
            })
            print(sc.Course.name)
        # if not serializer.is_valid():
        #     print(serializer.errors)
        # data = serializer.validated_data
        # serializer.save(Student=user,Course=course,marks=marks)
        #headers = self.get_success_headers(serializer.data)
        return Response({'info': StudentSerializer(user).data,'courses':records,"status":"200"}, status=status.HTTP_200_OK)
class StudentCoursesUpdateDelete(generics.GenericAPIView):
    serializer_class=StudentCoursesSerializer
    def get(self,request,*args, **kwargs):
        roll=self.kwargs.get('roll')
        course_no=self.kwargs.get('course')
        user=Student.objects.get(roll_no=roll)
        course_no=AllCourses.objects.get(course_no=course_no)
        student_courses=StudentCourses.objects.filter(Student=user,Course=course_no)
        if student_courses:
            return Response({'info': StudentSerializer(user).data,'courses':student_courses.values(),"status":"200"}, status=status.HTTP_200_OK)
        return Response({'info': StudentSerializer(user).data,'courses':"no such course","status":"200"}, status=status.HTTP_200_OK)

    def put(self,request,*args,**kwargs):
        id=self.kwargs.get('roll')
        course_no=self.kwargs.get('course')
        user=""
        course=""
        user=Student.objects.get(roll_no=id)
        
        course=AllCourses.objects.get(course_no=course_no)
        print(user.name,course.name)
        p=StudentCourses.objects.filter(Student=user,Course=course)
        if p.count()>0:
            # user=Student.objects.get(roll_no=id)
            # course=AllCourses.objects.get(course_no=course_no)
            # stud_course=StudentCourses.objects.filter(Student=user,Course=course)
            p.update(marks=request.data['marks'])
            return Response({'info': "updated","status":"200"}, status=status.HTTP_200_OK)
        
        return Response({"msg":"No such User or Course","status":"401"},status=status.HTTP_401_UNAUTHORIZED)
        #serializer = StudentCoursesSerializer(stud_course, data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        
        
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,*args, **kwargs):
        id=self.kwargs.get('roll')
        course_no=self.kwargs.get('course')
        user=""
        course=""
        stud_course=""
        try:
            user=Student.objects.get(roll_no=id)
            course=AllCourses.objects.get(course_no=course_no)
            stud_course=StudentCourses.objects.filter(Student=user,Course=course)
        except:
            return Response({"error":"No such User or Course","status":"401"},status=status.HTTP_401_UNAUTHORIZED)
        stud_course.delete()
        return Response({'msg': "Record deleted","status":"200"}, status=status.HTTP_200_OK)

class GPA(generics.GenericAPIView):
    serializer_class=StudentCoursesSerializer
    def get(self,request,*args,**kwargs):
        roll=self.kwargs.get('roll')
        course_no=""
        user=""
        try:
            course_no=self.kwargs.get('course')
            user=Student.objects.get(roll_no=roll)
            if not course_no:
                raise Exception("CGPA")
            course=AllCourses.objects.get(course_no=course_no)
            print(user.name,course.name)
            p=StudentCourses.objects.get(Student=user,Course=course)
            print(p)
            if not p:
                return Response({"msg":"No Courses Added","status":"404"})
            if p.marks=="":
                return Response({"msg":"Marks Not Added Yet","status":"401"})
            return Response({'gpa': gpa(int(p.marks)),"status":"200"}, status=status.HTTP_200_OK)
        
        except Student.DoesNotExist:
            return Response({"msg":"No Student Found","status":"404"})
        except AllCourses.DoesNotExist:
            return Response({"msg":"No Course Found","status":"404"})
        except StudentCourses.DoesNotExist:
            return Response({"msg":"No Courses Added","status":"404"})
        except:
            student_courses=StudentCourses.objects.filter(Student=user)
            if student_courses.count()>0:
                records=[int(sc.marks) for sc in student_courses.all() if sc.marks]
                if records:
                    return Response({'noOfCourses':len(records),'cgpa': cgpa(records),"status":"200"}, status=status.HTTP_200_OK)
                else:
                    return Response({"msg":"Could Not Calculate CGPA","status":"404"})
            elif student_courses.count()==0:
                return Response({"msg":"No Courses Added","status":"404"})
            return Response({"msg":"No Courses Found","status":"404"})
    

        
    
        
