import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import "./styles.css"

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
              active:false
              
        };
      }
    _handleClick(menuItem) { 
        this.setState({ active: menuItem });
      }
    logOut (e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
    }

    render () {
        const activeStyle = { color: '#ff3333' };
        return (
            <nav className="navbar navbar-expand-lg navbar-dark color-nav rounded">
                <button className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar1"
                    aria-controls="navbar1"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse justify-content-md-center"
                    id="navbar1">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link" >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                    <Link to="/students" className="nav-link">
                        Students
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/addCourse" className="nav-link">
                        Courses
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/gpa" className="nav-link">
                        GPA
                    </Link>
                </li>
                        
                    </ul>
                    
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar)