import React, { Component } from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm
} from "react-crud-table";
import axios from 'axios'

import { withAlert,useAlert } from "react-alert";
import { useState, useEffect } from "react";
// Component's Base CSS
import "./index.css";
import { render } from "@testing-library/react";
import renderIf from './renderIf'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import SplitButton from 'react-bootstrap/SplitButton'
let styles = {
  container: { margin: "auto", width: "fit-content" }
};
 




const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};
const getSorter = data => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};
class AddCourse extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
        students:[],
        studentSelected:"Select Student",
        coursesCheck:false,
        courses:[],
        noCourses:false,
        defaultCourses:[],
        course_no:0,
        roll_no:0
        
  };
}
create(task){
console.log(this.state.roll_no+' '+this.state.course_no+' '+task.marks)
    if(task.marks==null || task.marks=="" || task.marks==undefined){
        task.marks=""
    }
    
    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
    }
    var receivedCourses=[]
    this.setState({coursesCheck:false})
    for (var index=0;index<this.state.courses.length;index++){
        var course=this.state.courses[index]
        console.log(course.Course_no)
        if(course.Course_no==this.state.course_no){
            this.props.alert.error("Course already added")
            this.setState({coursesCheck:true})
            return Promise.resolve(task);
        }
    }
    axios.post('http://127.0.0.1:8000/'+String(this.state.roll_no)+'/add/'+String(this.state.course_no)+"/", {
      "marks": task.marks,
      "Student": "null",
      "Course": "null"
        }, {
        headers: headers
      })
    .then((response) => {
        console.log(response.data)
        
        receivedCourses.push(response.data.courses)
        this.setState({
            courses:receivedCourses[0],
            coursesCheck:true,

        })
    }, (error) => {
      alert(error);
    });
    
    return Promise.resolve(task);
  }
componentDidMount(){
    var Courses=[]
    axios.get('http://127.0.0.1:8000/course').then((response) => {
      console.log(response.data.courses);
      Courses.push(response.data.courses)
      console.log(Courses)
      if (response.data.courses.length>0){
          this.setState({
            defaultCourses:Courses[0],
            course_no:Courses[0][0].course_no
          })
      }
      console.log(this.state.defaultCourses)
      console.log(this.state.course_no)
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
    axios.get('http://127.0.0.1:8000/').then((response) => {
        console.log(response.data);
        var studs=[]
        var studs2=[]
        studs.push(response.data.students)
        console.log(studs[0]['0'])
        for (var i=0;i<studs[0].length;i++){
          studs2.push(studs[0][String(i)])
        }
        this.setState({
          students:studs2
        })
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
      });
      
}
fetchItems=(payload) => {
  let result = Array.from(this.state.courses);
  result = result.sort(getSorter(payload.sort));
  return Promise.resolve(result);
}
dataUpdated(){
    var receivedCourses=[]
    this.setState({
        coursesCheck:false
    })
    axios.get('http://127.0.0.1:8000/'+String(this.state.roll_no)+'/').then((response) => {
        console.log(response.data.courses)
        if (response.data.courses==="no courses found"){
            this.props.alert.error("No Courses Added")
            this.setState({
                courses:[],
                coursesCheck:true,

            })
        }
        else{
            receivedCourses.push(response.data.courses)
            this.setState({
                courses:receivedCourses[0],
                coursesCheck:true,

            })
        console.log(receivedCourses[0])
        }
    
    })
}
update(data) {
    const course=(this.state.courses.find(t=>t.id===data.id))
    if(course.marks==data.marks){
      this.props.alert.error("Update Marks First")
      return Promise.resolve(data)
    }
  const headers = {
    'Content-Type': 'application/json',
  }
  const url='http://127.0.0.1:8000/'+String(this.state.roll_no)+'/'+String(data.Course_no)+'/';
  console.log(url)
  axios.put(url, {
    "marks": String(data.marks),
    "Student": "null",
      "Course": "null"
      }, {
      headers: headers
    })
  .then((response) => {
    console.log(response.data)
    this.dataUpdated()
  }, (error) => {
    alert(error);
  });
  return Promise.resolve(data)
}
delete(data) {
    const headers = {
      'Content-Type': 'application/json',
    }
    const url='http://127.0.0.1:8000/'+String(this.state.roll_no)+'/'+String(data.Course_no)+'/';
    axios.delete(url, {
        headers: headers
      })
    .then((response) => {
        console.log(response.data)
        this.dataUpdated()
    }, (error) => {
      alert(error);
    });
    return Promise.resolve(data);
  }

handleSelect(eventKey, event) {
    var receivedCourses=[]
    this.setState({ studentSelected: this.state.students[eventKey].name+','+this.state.students[eventKey].roll_no,
    coursesCheck:false,
    roll_no:this.state.students[eventKey].roll_no,
                    });
    axios.get('http://127.0.0.1:8000/'+String(this.state.students[eventKey].roll_no)).then((response) => {
        console.log(response.data.courses)
        if (response.data.courses==="no courses found"){
            this.props.alert.error("No Courses Added")
            this.setState({
                courses:[],
                coursesCheck:true,

            })
        }
        else{
            receivedCourses.push(response.data.courses)
            this.setState({
                courses:receivedCourses[0],
                coursesCheck:true,

            })
        console.log(receivedCourses[0])
    }
    })
  }
  
  handleCourse(event){
    this.setCourse(event.target.value)
  }
  setCourse(val){
    this.setState({
        course_no:val
    })
    console.log(this.state.course_no)
  }
  
render() {
  const DescriptionRenderer = ({ field }) => <textarea {...field} />
 
  const DropdownRenderer = ({ field }) => (
    <select
      name={field.name}
      value={field.value}
      onChange={this.handleCourse.bind(this)}
    >
        <option value="DEFAULT" disabled>Select Course</option>
    {this.state.defaultCourses.map((course,i)=>(
    <option key={course.id} eventKey={course.course_no} id={course.id} value={course.course_no}>{course.course_no+','+course.name}</option>
    ))}
    </select>
  );

  return (
    <div >
        <div
        style={{
            display: 'flex',  justifyContent:'center', alignItems:'center'
        }}>
    <SplitButton
        key="Select Student"
        id="basic"
        variant="info"
        title={this.state.studentSelected}
        onSelect={this.handleSelect.bind(this)}
        style={{
            marginTop: "5%",
            width:"50%"
           
        }}
      >
      {this.state.students.map((student,i)=>(
      <Dropdown.Item id={String(student.roll_no)} key={i} eventKey={i}>{student.name+','+student.roll_no}</Dropdown.Item>
      
      ))}
      </SplitButton>
      </div>
    <div style={styles.container}>
        
        {renderIf(this.state.coursesCheck)(
    <CRUDTable
      caption="Courses"
    fetchItems={payload=>this.fetchItems(payload)}>
      <Fields>
      <Field
      hideFromTable
          name="course"
          label="Course"
          render={DropdownRenderer}
          hideInUpdateForm
        />
        <Field name="id" label="Id" hideInCreateForm hideInUpdateForm />
        <Field name="Course_name" label="Course_name" placeholder="Course_name" hideInUpdateForm hideInCreateForm/>
        <Field
          name="Course_no"
          label="Course_no"
          hideInCreateForm
          hideInUpdateForm
        />
        <Field
          name="marks"
          label="Marks"
        />
      </Fields>
      <CreateForm
        title="Course"
        message="Add new Course!"
        trigger="Add Course"
        onSubmit={task => this.create(task)}
        submitText="Add"
        
        validate={values => {
          const errors = {};
          
        }}
      />
        <UpdateForm
        title="Update Course" 
        message="Update Course"
        trigger="Edit"
        onSubmit={task => this.update(task)}
        submitText="Edit"
        validate={values => {
          const errors = {};
          return errors;
        }}
      />

      <DeleteForm
        title="Delete Student"
        message="Are you sure you want to delete the Student?"
        trigger="Remove"
        onSubmit={task => this.delete(task)}
        submitText="Delete"
        validate={values => {
          const errors = {};
          
          return errors;
        }}
    />
    </CRUDTable>
        )}
  </div>
  
  </div>
  );
}
}

export default withAlert()(AddCourse);