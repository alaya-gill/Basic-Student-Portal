import React, { Component } from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
  Pagination
} from "react-crud-table";
import axios from 'axios'
import { useState, useEffect } from "react";

import { withAlert,useAlert } from "react-alert";
// Component's Base CSS
import "./index.css";
import renderIf from './renderIf'
import { render } from "@testing-library/react";
let styles = {
  container: { margin: "auto", width: "fit-content" }
};
 
 var tasks = [
    {
      id: 1,
      title: "Create an example",
      description: "Create an example of how to use the component"
    },
    {
      id: 2,
      title: "Improve",
      description: "Improve the component!"
    }
  ];
  



let count = tasks.length;

const service = {
  create: task => {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    axios.post('http://127.0.0.1:8000', {
      "name": task.name,
      "roll_no": task.roll_no,
      "email": task.email,
      "phone":task.phone,
      "address": task.address
        }, {
        headers: headers
      })
    .then((response) => {
      //alert(response.data);
    }, (error) => {
      alert(error);
    });
    this.refresh()
    return Promise.resolve(task);
  },
  update: (data,students) => {
    const student=(students.find(t=>t.id===data.id))
    if(student.name==data.name && student.phone==data.phone && student.email==data.email && student.address==data.address){
      this.props.alert.show("Update Info First")
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const url='http://127.0.0.1:8000/'+String(data.roll_no)+'/';
    axios.put(url, {
      "name": data.name,
      "roll_no": data.roll_no,
      "email": data.email,
      "phone":data.phone,
      "address": data.address
        }, {
        headers: headers
      })
    .then((response) => {
      alert(response.data);
    }, (error) => {
      alert(error);
    });
  },
  delete: (data) => {
    const headers = {
      'Content-Type': 'application/json',
    }
    const url='http://127.0.0.1:8000/'+String(data.roll_no)+'/';
    axios.delete(url, {
        headers: headers
      })
    .then((response) => {
      alert(response.data);
    }, (error) => {
      alert(error);
    });
    return Promise.resolve(data);
  }
};


class Example extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
        students:[],
        nowRender:true
  };
  this.component()
}
SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};
getSorter(data) {
  const mapper = x => x[data.field];
  let sorter = this.SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? this.SORTERS.NUMBER_ASCENDING(mapper)
        : this.SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? this.SORTERS.STRING_ASCENDING(mapper)
        : this.SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};
component(){
  

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
        students:studs2,
        nowRender:true
      })
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
}
fetchItems=(payload) => {
  const { activePage, itemsPerPage } = payload.pagination;
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
  let result = Array.from(this.state.students);
  result = result.sort(this.getSorter(payload.sort));
  return Promise.resolve(result.slice(start, end));
  //return Promise.resolve(result);
}
fetchTotal(payload){
  return Promise.resolve(this.state.students.length);
}
validateValues(task){
  if (!(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(task.email))){
    this.props.alert.error("This is Not a Valid EmailID!!");
    return false
  }
  if(99>task.roll_no||task.roll_no>1000){
    this.props.alert.error("This is Not a Valid Roll_No!!");
    return false
  }
  console.log(task.phone.length)
  if(task.phone[0]=="+" && task.phone.length==13){
    
    return true
  }
  else{ this.props.alert.error("This is Not a Valid Phone No!!");return false}
  return true
}
create(task){
  const headers = {
    'Content-Type': 'application/json',
  }
  if(!this.validateValues(task)){return Promise.resolve(task);}
  axios.post('http://127.0.0.1:8000', {
    "name": task.name,
    "roll_no": task.roll_no,
    "email": task.email,
    "phone":task.phone,
    "address": task.address
      }, {
      headers: headers
    })
  .then((response) => {
    //alert(response.data);
  }
  ).catch((error)=>{
    alert(error)
  })
  this.refresh()
}
update= (data) => {
  const student=(this.state.students.find(t=>t.id===data.id))
  if(student.name==data.name && student.phone==data.phone && student.email==data.email && student.address==data.address){
    this.props.alert.show("Update Info First")
  }
  const headers = {
    'Content-Type': 'application/json',
  }
  if(!this.validateValues(data)){return Promise.resolve(data);}
  const url='http://127.0.0.1:8000/'+String(data.roll_no)+'/';
  axios.put(url, {
    "name": data.name,
    "roll_no": data.roll_no,
    "email": data.email,
    "phone":data.phone,
    "address": data.address
      }, {
      headers: headers
    })
  .then((response) => {
    console.log(response.data)
    this.setState({
      students:response.data
    })
  }, (error) => {
    alert(error);
  });
  this.refresh()
}
refresh(){
  window.location.reload();
}
render() {
  const DescriptionRenderer = ({ field }) => <textarea {...field} />
  return (
    <div style={styles.container}>
    {renderIf(this.state.nowRender)( 
    <CRUDTable
      caption="Students"
      fetchItems={payload=>this.fetchItems(payload)}
    >
      <Fields>
        <Field name="id" label="Id" hideInCreateForm hideInUpdateForm />
        <Field name="name" label="Name" placeholder="Name" />
        <Field
          name="roll_no"
          label="Roll_no"
          placeholder="XXX"
          hideInUpdateForm
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="gillalaya@gmail.com "
        />
        <Field
          name="phone"
          label="Phone"
          placeholder="+923006860265"
        />
        <Field
          name="address"
          label="Address"
          render={DescriptionRenderer}
        />
      </Fields>
      <Pagination
        itemsPerPage={2}
        fetchTotalOfItems={payload => this.fetchTotal(payload)}
      />
      <CreateForm
        title="Student"
        message="Add new Student!"
        trigger="Add Student"
        onSubmit={task => this.create(task)}
        submitText="Add"
        validate={values => {
          const errors = {};
          if (!values.name){errors.name = "Provide details";}
          if (!values.roll_no){errors.roll_no = "Provide details";}
          if (!values.address){errors.address = "Provide details";}
          if (!values.phone){errors.phone = "Provide details";}
          if (!values.email){errors.email = "Provide details";}
          return errors;
        }}
      />
      <UpdateForm
        title="Update Student" 
        message="Update Student Info"
        trigger="Edit"
        onSubmit={task => this.update(task)}
        submitText="Update"
        validate={values => {
          const errors = {};
          if (!values.name){errors.name = "Provide details";}
          if (!values.address){errors.address = "Provide details";}
          if (!values.phone){errors.phone = "Provide details";}
          if (!values.email){errors.email = "Provide details";}

          return errors;
        }}
      />

      <DeleteForm
        title="Delete Student"
        message="Are you sure you want to delete the Student?"
        trigger="Remove"
        onSubmit={task => {service.delete(task);this.refresh()}}
        submitText="Delete"
        validate={values => {
          const errors = {};
          if (!values.id) {
            errors.id = "Please, provide id";
          }
          return errors;
        }}
      />
    </CRUDTable>
    )}
  </div>
  );
}
}

export default withAlert()(Example);