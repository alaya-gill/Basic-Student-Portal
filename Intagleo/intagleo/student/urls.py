from django.urls import path

from . import views

urlpatterns = [
    path('',views.AddStudent.as_view()),
    path('<int:roll>/',views.UpdateDeleteStudent.as_view()),
    path('course/',views.Course.as_view()),
    path('<int:roll>/add/<int:course>/',views.StudentCoursesAdd.as_view()),
    path('<int:roll>/<int:course>/',views.StudentCoursesUpdateDelete.as_view()),
    path('gpa/<int:roll>/<int:course>/',views.GPA.as_view()),
    path('gpa/<int:roll>/',views.GPA.as_view()),


]