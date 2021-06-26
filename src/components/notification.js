import React, { Component } from 'react'
import socket from '../socketConfig'
import {store,globalUser} from '../state/store'
import '../styles/notification.css'




export class notification extends Component {
    constructor(props){
        super(props)

        

        this.state = {
            user : '',
            showNotification: false
        }

        socket.on('notify', response=>{
            this.setState({user: response._id})
            console.log(response._id)
            this.display()
        })
    }

    display = () => {
        // if state.user is equal to global user set show notification to true
        if(this.state.user == store.getState().User){
            this.setState({showNotification: true})
            console.log('display')
        }
        console.log(store.getState().User) 
    }

    closePanel = () =>{
        // document.querySelector('.notification_container').style.display = 'none'
        this.setState({showNotification: false})
    }

    render() {
       

        return (
            <div style={{display: this.state.showNotification ? 'grid' : 'none'}} className='notification_container'>
                <p className="notification_header">
                    <span className='ji'>Just in</span> 
                    <span className='time'> Time</span>
                </p>
                <p className="notification_message">
                    Yous just received {this.props.amount} from {this.props.User}
                </p>
                <p onClick={this.closePanel} className="notification_close"><i class="fas fa-times"></i></p>
            </div>
        )
    }
}

export default notification
