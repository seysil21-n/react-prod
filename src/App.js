import './App.css';
import io  from "socket.io-client";
import React from 'react';
import Register from './components/Register'
import Login from './components/Login'
import {BrowserRouter as Router,Switch,Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import Dashbaord from './components/Dashbaord';



class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      loginValidation: '',
      user: null,
      legitUser: false
    }

    this.auth = this.auth.bind(this)
    this.getFields = this.getFields.bind(this)
    this.submitLogin = this.submitLogin.bind(this)
  }

  // get login fields
  getFields = (e) => {
    console.log(e.target.value)
    this.setState({[e.target.name]: e.target.value})
  }

  //calling the auth api
  auth = async () =>{
    
    if(this.state.email !== '' && this.state.password !== '' ){
    try {
        let authUser = await axios.post('http://10.0.2.15:3000/api/users/login', 
         {email: this.state.email, password: this.state.password} ,
         {headers: {'Content-type': 'application/json' } }
        
        )

        console.log(authUser)
        if(authUser.data.err)
        this.setState({loginValidation: authUser.data.err})
        
        if(authUser.data.user){
          this.setState({legitUser: true})
          this.setState({user: authUser.data.user})

        }

        if(authUser.data.token)
            sessionStorage.setItem('token', authUser.data.token)  
        //     // redirect to dashboard
            


    } catch (error) {
        console.log(error)
    }
  }

  if(this.state.email === '' || this.state.password === ''){
    this.setState({loginValidation: 'All fields are Required'})
  }
}




    submitLogin = (e)=> {
      this.auth();
      e.preventDefault()
    }


  render(){
    return (
      <Router>
      <Switch>

        {/* index page route */}
        <Route exact path='/'>
          {this.state.user !== null ? <Redirect to='/dashboard'/> : <Redirect to='/login'/>}
        </Route>

        {/* login page route */}
        <Route path='/login' render={()=>(
                // legit prop is to display loader if user is indeed authentic before showing the dashboard
                <Login legit={this.state.legitUser} validation={this.state.loginValidation} user={this.state.user} redirect={(e)=> {}} getFields={this.getFields} submitLogin={this.submitLogin}/>
                
                )} >
                
                
        </Route>

        {/* register page route */}
        <Route path='/register' render={()=>(
                <Register />
              )} >
        </Route>
          
        {/* dashboard route */}
        <Route path='/dashboard' render={()=>(
                <Dashbaord user={this.state.user}/>
              )} >
        </Route>
       
      
      </Switch>
      </Router>
      )
 
  }

}

export default App;
