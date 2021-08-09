import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Loader from "react-loader-spinner";
import {Link} from 'react-router-dom'
import '../styles/register.css'
import axios from 'axios';

export class Register extends Component {
  constructor(props){
    super(props)

    this.state = {
      fullName: '',
      email:'',
      password: '',
      confirmPassword: '',
      phone:'',
      valErrors: '',
      passwordNm: '',
      success: ''
    }
  }

  getFields = (e) => {
    console.log(e.target.value)
    this.setState({[e.target.name]: e.target.value})
  }

  registerUserVal =  (e) => {
    e.preventDefault()
    const {password,email,confirmPassword,phone} = this.state
    if(password == '' || email == '' || confirmPassword == '' || phone == ''){
      this.setState({valErrors: 'All Fields are required'})
    
    } 

    if(password !== confirmPassword)
        this.setState({passwordNm: 'Passwords do not match'})

    //if all fields are appropriate do an axios call
    if(this.state.valErrors == '' && this.state.passwordNm == '')
      this.registerUser()

  }

  registerUser = async () => {
    const response = await axios.post('http://147.182.135.17:3000/api/users/register', 
    {fullName: this.state.fullName, email: this.state.email, password: this.state.password, phone: this.state.phone} ,
    {headers: {'Content-type': 'application/json' } })

    if(response.data.success){
      this.setState({success : response.data.success})

      setTimeout(() => {  
        window.location.replace('/login')
      }, 3000);
    }
    
  }

  errorStyle = () => {
    if(this.state.valErrors !== '')
     return '1px solid red'
  }

  passwordNotMatch = () => {
    if(this.state.passwordNm !== '')
      return '1px solid red'
  }

    render() {
        return (
          <>
          <div style={{display: this.state.success == '' ? 'none' :'block' }} className="smc">
            <div  className='successMessage' > <h5>Congrats, You have Successfully Signed up</h5> <p>We're taking you to the Login page</p> <Loader className='loader' color="green"  height="1.5rem" type="TailSpin"/> </div>
          </div>
            <div className='registerContainer'>
                <Form onSubmit={this.registerUserVal} className="center" md={6}>
                <div className="logo">lexPay</div>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="exampleEmail">Full Name</Label>
                  <Input required onChange={this.getFields} type="text" name="fullName" id="fullName" placeholder="Full Name" />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input required onChange={this.getFields} type="email" name="email" id="exampleEmail" placeholder="Email" />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input required style={{border: this.passwordNotMatch()}} onChange={this.getFields} type="password" name="password" id="examplePassword" placeholder="Password" />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="exampleAddress">Confirm Password</Label>
              <Input required style={{border: this.passwordNotMatch()}} onChange={this.getFields} type="password" name="confirmPassword" id="exampleAddress" placeholder="Confirm Password"/>
            </FormGroup>
            <FormGroup>
              <Label for="exampleAddress">Phone</Label>
              <Input required   onChange={this.getFields} type="number" name="phone" id="exampleAddress" placeholder="Phone"/>
            </FormGroup>
           

             
            
            <p style={{color: 'red', display: this.state.passwordNm !== '' ? 'block' : 'none'}}>{this.state.valErrors} <br /> {this.state.passwordNm}</p>
            <Button>Sign Up</Button><Link className='ml-2' to='/login'>login</Link>
          </Form>
            </div>
            </>
            
        )
    }
}

export default Register
