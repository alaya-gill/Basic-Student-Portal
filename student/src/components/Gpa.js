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
import { useState, useEffect } from "react";
// Component's Base CSS
import "./index.css";
import { render } from "@testing-library/react";
import renderIf from './renderIf'
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { withAlert,useAlert } from "react-alert";
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

class GPA extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
        students:[],
        studentSelected:"Select Student",
        coursesCheck:false,
        courses:[],
        noCourses:true,
        defaultCourses:[],
        course_no:0,
        roll_no:0,
        course:"Select Course",
        studentExist:false,
        coursesExist:false,
        cgpa:0,
        gpa:0
        
  };
}

componentDidMount(){
    var Courses=[]
    
    axios.get('http://127.0.0.1:8000/').then((response) => {
        console.log(response.data);
        var studs=[]
        var studs2=[]
        studs.push(response.data.students)
        console.log(studs[0]['0'])
        for (var i=0;i<studs[0].length;i++){
          studs2.push(studs[0][String(i)])
        }
        if(studs2.length>0){
        this.setState({
          students:studs2,
          studentExist:true
        })
    }
        else{
            this.props.alert.show("No Students Found")
            return;
        }
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
      });
      axios.get('http://127.0.0.1:8000/course').then((response) => {
      console.log(response.data.courses);
      Courses.push(response.data.courses)
      console.log(Courses)
      if (response.data.courses.length>0){
          this.setState({
            defaultCourses:Courses[0],
            course_no:Courses[0][0].course_no,
            coursesExist:true
          })
      }
      else{
          this.props.alert.show("No Courses Found")
          return;
      }
      console.log(this.state.defaultCourses)
      console.log(this.state.course_no)
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
      
}
cgpa(eventKey){
    axios.get('http://127.0.0.1:8000/gpa/'+String(this.state.students[eventKey].roll_no+'/')).then((response) => {
        console.log(response.data.courses)
        
        if (response.data.status==="200"){
            
           this.props.alert.show("CGPA: "+response.data.cgpa)
            /*this.setState({
                courses:[],
                coursesCheck:true,
                noCourses:false

            })*/
        }
        else{
            this.props.alert.show(response.data.msg)
        
    }
    })
}
checkCourses(eventKey){
    
    var receivedCourses=[]
    this.setState({noCourses:false})
    axios.get('http://127.0.0.1:8000/'+String(this.state.students[eventKey].roll_no)).then((response) => {
        console.log(response.data.courses)
        if (response.data.courses==="no courses found"){
            
           this.props.alert.show("No Courses Added")
            this.setState({
                courses:[],
                coursesCheck:false,
                noCourses:false

            })
        }
        else{
            receivedCourses.push(response.data.courses)
            this.setState({
                courses:receivedCourses[0],
                coursesCheck:true,
                noCourses:true

            })
        console.log(receivedCourses[0])
        this.cgpa(eventKey)
        
    }
    })
}
handleSelect(eventKey, event) {
    this.setState({ studentSelected: this.state.students[eventKey].name+'-'+this.state.students[eventKey].roll_no,
    coursesCheck:false,
    roll_no:this.state.students[eventKey].roll_no,
                    });
    this.checkCourses(eventKey)
    
    
  }
  
  handleCourse(eventKey,event){
    /*this.setState({ course: this.state.defaultCourses[eventKey].name+'-'+this.state.defaultCourses[eventKey].course_no,
                    course_no:this.state.defaultCourses[eventKey].course_no,
    
    })*/
    this.setCourse(eventKey)
    this.gpa(eventKey)
    
  }
  gpa(eventKey){
    axios.get('http://127.0.0.1:8000/gpa/'+String(this.state.roll_no)+'/'+String(this.state.courses[eventKey].Course_no)).then((response) => {
        //console.log(response.data.courses)
        
        if (response.data.status==="200"){
            
           this.props.alert.show("GPA: "+response.data.gpa)
            /*this.setState({
                courses:[],
                coursesCheck:true,
                noCourses:false

            })*/
        }
        else{
            console.log(response.data)
            this.props.alert.show(response.data.msg)
        
    }
    }).catch((error)=>{alert(error.status)})
  }
  setCourse(eventKey){
    this.setState({ course: this.state.courses[eventKey].Course_name+'-'+this.state.courses[eventKey].Course_no,
    course_no:this.state.courses[eventKey].Course_no,

})
  }
  fetchItems=(payload) => {
    let result = Array.from(this.state.courses);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  }
render() {
  const DescriptionRenderer = ({ field }) => <textarea {...field} />
  
  const DropdownRenderer = ({ field }) => (
    <select
      name={this.state.course}
      value={this.state.course}
      onChange={this.handleCourse.bind(this)}
      style={{
        marginTop: "5%",
        width:"50%",
        padding:"8px",
        borderRadius:'5px',
        border:'none',
        backgroundColor:"#00ce67"
    }}
    >
    {this.state.defaultCourses.map((course,i)=>(
    <option style={{backgroundColor:"beige"}} key={course.id} eventKey={course.course_no} id={course.id} value={course.course_no+'-'+course.name}>{course.course_no+'-'+course.name}</option>
    )
    )}
    </select>

    
  );

  return (
    <div >
        {renderIf(this.state.studentExist)(<div
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
      </div>)}
        
      {renderIf(this.state.coursesExist && this.state.studentSelected!="Select Student" && this.state.noCourses)(<div
        style={{
            display: 'flex',  justifyContent:'center', alignItems:'center'
        }}>
    <SplitButton
        key="Select Course"
        id="course"
        variant="success"
        title={this.state.course}
        onSelect={this.handleCourse.bind(this)}
        style={{
            marginTop: "5%",
            width:"50%"
           
        }}
      >
      {this.state.courses.map((student,i)=>(
      <Dropdown.Item id={String(student.Course_no)} key={i} eventKey={i}>{student.Course_name+'-'+student.Course_no}</Dropdown.Item>
      
      ))}
      </SplitButton>
   </div>)}
      
    <div style={styles.container}>
    {renderIf(this.state.coursesCheck)(
    <CRUDTable
      caption="Courses"
    fetchItems={payload=>this.fetchItems(payload)}>
      <Fields>
        
        <Field name="id" label="Id"/>
        <Field name="Course_name" label="Course_name" placeholder="Course_name" />
        <Field
          name="Course_no"
          label="Course_no"
        />
        <Field
          name="marks"
          label="Marks"
        />
      </Fields>
    </CRUDTable>
        )}
  </div>
  
  </div>
  );
}
}

export default withAlert()(GPA);