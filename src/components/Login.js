import React, { Component } from 'react'
import Loader from "react-loader-spinner";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {Link, Redirect, withRouter} from 'react-router-dom'

import '../styles/register.css'


export class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
          email: '',
          password : '',
          user: null,
          loggedOut: false
        }
    }

    componentDidMount(){
      console.log(this.state,"s")
    }

    redirectToHome = () => {
      const { history } = this.props;
      
      if(this.props.user !== null) {


      }

      setTimeout(() => {
        console.log(this.props.user)
        this.setState({user: this.props.user})
      }, 2000); 
      
      setTimeout(() => {
        console.log(this.state)
        this.state.user !== null ? history.push('/dashboard') : console.log('notl')
      }, 3000);



    }
   


    render() {
        return (
            <>
            {this.state.user !== null ? <Redirect to='/dashboard'/> : <Redirect to='/login'/>}

            <div style={{display: this.props.legit === false ? 'none' : 'block'}} className='cusLoader'>
              <div className="cusLoaderInner"><Loader height='2rem' color="violet" type='TailSpin'/></div>
            </div>
            
            <div className='registerContainer'>
            <Form className="center" md={6} onSubmit={this.props.submitLogin}>
            <div className="logo">lexPay</div>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input autoCapitalize="true" type="text" onInput={this.props.getFields} name="email" id="exampleEmail" placeholder="Email" />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input type="password" onInput={this.props.getFields} name="password" id="examplePassword" placeholder="Password" />
            </FormGroup>
          </Col>
        </Row>
        <p style={{color: 'red', display: this.props.validation !== '' ? 'block' : 'none' }}>{this.props.validation}</p>
        
        <Button  onMouseDown={this.redirectToHome}> <span>Sign in</span>  </Button>  <Link className='ml-2 signup' to="/register">Sign up</Link>
      </Form>
        </div>
        </>
        )
    }
}

export default withRouter(Login) 
