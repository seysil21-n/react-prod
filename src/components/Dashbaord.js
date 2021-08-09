import React, { Component } from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Switch,Route, withRouter, Redirect} from 'react-router-dom'
import '../styles/dashboard.css'
import Sidebar  from './sidebar_dashboard'
import ContentDashboard from './content_dashboard'
import Cards from './Cards'
import Login from '../components/Login'

import {store,globalUser} from '../state/store'

export class Dashbaord extends Component {
    constructor(props){
        super(props)

        this.state = {
            user: 'null'
        }

        
        this.loadSession = this.loadSession.bind(this)
    }

    loadSession = async () => {

        
        const session = await axios.get('http://127.0.0.1:3000/api/users/dashboard', { 
            headers: {
                'Accept': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        })

        
        console.log(session.data)

        this.setState({user: session.data})
        store.dispatch(globalUser(session.data._id))
        console.log(store.getState())


        
    }

    componentDidMount(){
        this.loadSession()
        
    }

    // check if logged in 
    authCheck = () =>{
        if(!sessionStorage.getItem('token')){
            console.log('authchecking')
            return <Redirect to='login'/>
        }
    }




    render() {
        return (
            <>
            { this.authCheck() }
            <Router>
               
            <div className="dashboard_container">
                
               {this.state.user === 'null' ? 'loading' : <Sidebar user={this.state.user}/>}
               {/* {this.state.user === 'null' ? 'loading' : <Notification user={this.state.user}/>} */}
               <Switch>
                    <Route exact path='/cards' render={()=> ( <Cards user={this.state.user}/>)} />  
                    <Route exact path='/dashboard' render={()=> ( <ContentDashboard user={this.state.user}/>)} />  
               </Switch>
               
               
            </div>
            </Router>
            </>
        )
    }
}

export default Dashbaord
