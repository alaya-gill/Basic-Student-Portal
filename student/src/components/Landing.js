import React, { Component } from 'react'
class Landing extends Component {
    componentDidMount() {
        document.body.style.backgroundColor = "aliceblue"
    }
    render () {
        return (
            <div className="container">
                <div className="jumbotron" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                <label style={{margin:'center',fontSize:'30px'}} className="text-center ">BASIC STUDENT PORTAL</label>
                
                </div>
                <div className="mx-auto col-sm-8  ">
                </div>
            </div>
        )
    }
}

export default Landing