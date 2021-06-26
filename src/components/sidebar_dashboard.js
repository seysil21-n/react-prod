import React, { Component } from 'react'
import {Link, BrowserRouter as Router, NavLink } from 'react-router-dom'
import Notification from '../components/notification'

export class Sidebar_Dashboard extends Component {

    constructor(props){
        super(props)

        this.state = {user: 'this.props.user'}

       console.log(this.props)
    }

    componentDidMount(){
    //    setTimeout(() => {
        this.setState({user : this.props.user})
    //    }, 3000);  
    }

    logout = (e) => {
        e.preventDefault()

        sessionStorage.removeItem('token')
        window.location.replace('/login')
    }


    render() {
        return (
            <div className="sidebarContainer">
                <div className='profile_sidebar'>
                    <img className='profileImage' style={{backgroundImage: this.state.user.profilePicture}} alt=""/>
                    <h6>{this.state.user.email}</h6>
                    
                </div>
                <div className="links_sidebar">
                    <NavLink to="/dashboard"  activeStyle={{borderRight: '2px solid hotpink',color: 'hotpink', backgroundColor : 'rgb(251, 251, 251)'}}> <i className="fas fa-exchange-alt"></i> Tranfer</NavLink>
                    <NavLink to="/cards" activeStyle={{borderRight: '2px solid hotpink',color: 'hotpink', backgroundColor : 'rgb(251, 251, 251)'}}>  <i className="fas fa-credit-card"></i> Cards</NavLink>
                    <Link to="#"> <i className="fas fa-history"></i> History</Link>
                </div>
                
                <div className="notification_containerr">
                    <Notification user={this.state.user}/>  
                </div>

                <div className="logout_sidebar">
                    <Link onClick={this.logout} to="/login" > <i className="fas fa-sign-out-alt"></i> Logout</Link>
                </div>
            </div>
        )
    }
}

export default Sidebar_Dashboard
