import React, { Component } from 'react'
// import io  from "socket.io-client";
import socket from '../socketConfig'
import axios from 'axios'
import Loader from "react-loader-spinner";
import '../styles/content_dashboard.css'
import tigo from '../logos/tigo.png'
import mtn from '../logos/mtn.jpeg'
import vodafone from '../logos/vodafone.jpg'
import direct from '../logos/direct.svg'
import checkmark from '../logos/checkmark.svg'
import {store,cards} from '../state/store'
 

// const socket = io('localhost:4000')


export class content_dashboard extends Component {
    constructor(props){
        super(props)
        console.log(this.props)
       

       

        this.state = {
               networkSelected: false,
               network: '',
               receipientInfo: '',
               amount: 0,
               destinationEmail: '',
               destinationName: '',
               confirmDestinationError:'',
               responseError: '',
               success:''
               
        }

        this.toggleLoader = this.toggleLoader.bind(this)

        console.log(store.getState())
    }


    componentDidMount(){
        this.selectedCard()
    }

    selectedCard = async () => {
        try {
            const response  = await axios.get('http://147.182.135.17:3000/api/users/cards/selectedCard', {headers: 
            {'accept': 'Application/json' , 'x-auth-token': sessionStorage.getItem('token')}})

            console.log(response)

            if(response.data.selectedCard) {
                store.dispatch(cards(response.data.selectedCard,response.data.selectedCardNumber,response.data.selectedCardBalance))

                //show selected card as marked
                console.log(store.getState().selectedCard)

            }






        } catch (error) {
            console.log(error)

        }
    }



    toggleNetwork = (e) =>{
        // let network = Array.from(e.target.classList)[1]
        // this.setState({networkSelected: !this.state.networkSelected, network})

        // setTimeout(() => {
        //     if(this.state.networkSelected){
                // e.target.children[0].style.display = 'grid'
    
        //         console.log(this.state.networkSelected)
        //         console.log(network)
        
        //         e.stopPropagation()
        //     }
        // }, 10);

        // setTimeout(() => {
        //     if(!this.state.networkSelected){
        //         e.target.children[0].style.display = 'none'
        //     }
        // }, 10);

        // get clicked network name
        let network = Array.from(e.target.classList)[1]
        
        if(network !== this.state.network)  {
            // set the state to tbe network selected        
            this.setState({networkSelected: true, network})
            
            // get all networks
            let networks = Array.from(e.target.parentElement.children)

            // filter to see all networks that arent selected
            let nsN =  networks.filter(network => !network.classList.contains(e.target.classList[1]))

            // filter to see networks that are selected
            let sN =  networks.filter(network => network.classList.contains(e.target.classList[1]))

            // set networks that arent selected no to display
            nsN.forEach(network => {
                network.children[0].style.display = 'none'
            });

            // set selected network to display 
            sN[0].children[0].style.display = 'grid'
            console.log(nsN)
        }
        
        // this.setState({networkSelected: !this.state.networkSelected, network})
        

        
        
        
       

    }

    confirmDestination = async () =>{


        let {receipientInfo, amount, network} = this.state

        if(receipientInfo == '' || amount == '0' || network == '' || amount == ''){
            this.setState({confirmDestinationError: 'Please fill all fields'})
        }

        if(network == ''){
            this.setState({confirmDestinationError: 'Please Select a network'})
        }

        if(receipientInfo !== '' && amount !== '' && network !== '' && amount !== 0 ){
            // only show modal to confirm if user exist if all fields has been filled
            document.querySelector('.confirm_transfer').style.display = 'grid'
            console.log('all')
            let response = await axios.post('http://147.182.135.17:3000/api/users/confirmDestination', 
            {receipientInfo: this.state.receipientInfo, network: this.state.network},
            {headers: {'Content-type': 'application/json', 'x-auth-token': sessionStorage.getItem('token')}})

            if(response.data.error) this.setState({responseError: response.data.error})

            if(!response.data.error) this.setState({destinationEmail: response.data.email, destinationName: response.data.name})



            
            console.log(response)
        }




    }

    getField  = (e) =>{
        this.setState({[e.target.name] : e.target.value  })
    }
    
    toggleReceipientInfoDetails = () => {
        if(this.state.destinationEmail !== '' || this.state.responseError !== ''){
            return 'grid'
        }
        else{
            return 'none'
        }
    }

    toggleLoader = () => {
        if(this.state.destinationEmail !== '' || this.state.responseError !== ''){
            console.log(this.state)
            return  false
        }
        else{
            return true
        }
    
        }
    
   
    
    
    closeCD = (e) => {
        document.querySelector('.confirm_transfer').style.display = 'none'

        e.preventDefault()
    }

    confirmTransfer =  () => {

    }

    creditAccount = async () => {
        const response  = await axios.post('http://147.182.135.17:3000/api/users/creditAccount',
        {destinationEmail: this.state.destinationEmail, amount: this.state.amount, sender: this.props.user.email},
        {headers: {'content-type' : 'application/json', 'x-auth-token': sessionStorage.getItem('token')}}
        
        )
        
        if(response.data.success){
            this.setState({success: response.data.success})
            document.querySelector('.confirm_transfer').style.display = 'none'
            socket.emit('credit', {destinationEmail : this.state.destinationEmail, amount: this.state.amount})
            console.log(store.getState())
        }
        
        // setTimeout(() => {
        //     window.location.replace('/dashboard')
        // }, 3000);

        }

    render() {
        return (
            <>
              <div style={{display: this.state.success == '' ? 'none' :'block' }} className="smc">
            <div  className='successMessage' > <img style={{display: this.state.success == '' ? 'none' : 'block'}} src={checkmark} alt="" /> <h5>Sent Successfully</h5> </div>
            </div>
            <div style={{position: 'relative'}} className="content_dashboard_container">
                <div className="confirm_transfer" style={{position: 'absolute', display: 'none'}}>

                <Loader className='loadPre' visible={false} height='2.9rem' color="hotpink" type='TailSpin'/>
                    <div style={{ display:  this.toggleReceipientInfoDetails }} className="confirm_transfer_inner"> 
                        <h6 style={{justifySelf:'center',alignSelf: 'center'}}>{this.state.responseError !== '' ? "" : this.state.destinationEmail}</h6>
                        <h2 style={{justifySelf:'center', alignSelf:'center'}}>{this.state.responseError !== '' ? this.state.responseError : this.state.destinationName}</h2>
                        <h6 style={{justifySelf:'center',alignSelf: 'center'}}>{this.state.responseError !== '' ? "" : this.state.amount}</h6>
                        <div style={{justifySelf:'start',alignSelf: 'center'}}><button onClick={this.creditAccount} className="confirm_btn">Confirm </button><a onClick={this.closeCD} style={{color: 'gray'}} href="#">Cancel</a></div>
                    </div>
                </div>
                <div className="container_content">
                    <h4>Transfer</h4>
                    <h6 style={{opacity: '0.6'}}>Balance: Ghc {store.getState().selectedCard.cardBalance}</h6><br/>

                    <div className="destination_details">
                        <h6>Networks</h6>
                        <div className="networks">
                            <div onClick={this.toggleNetwork} style={{backgroundImage: `url('${mtn}')`, backgroundSize: '100px'}} className="network mtn"> <div><i className="fas fa-check"></i></div> </div>
                            <div onClick={this.toggleNetwork} style={{backgroundImage: `url('${tigo}')`, backgroundSize: '100px'}} className="network tigo"> <div><i className="fas fa-check"></i></div> </div>
                            <div onClick={this.toggleNetwork} style={{backgroundImage: `url('${vodafone}')`, backgroundSize: 'contain', backgroundColor: 'white'}} className="network vodafone"> <div><i className="fas fa-check"></i></div> </div>
                            <div onClick={this.toggleNetwork} style={{backgroundImage: `url('${direct}')`, backgroundSize: '20px', backgroundColor: 'white'}} className="network direct"> <div><i className="fas fa-check"></i></div> </div>
                        </div>
                        <input className='cdi' name="receipientInfo" onInput={this.getField} type={this.state.network == 'direct' ? "email": 'number'} placeholder={this.state.network == 'direct' ? "Receipient Email": 'Receipient Number'} min="0"  />
                        <input className='cdi' name="amount" onInput={this.getField} placeholder="Amount" type="number"  min="0" />
                        <p style={{display: this.state.confirmDestinationError !== '' ? 'block': 'none', color:'red', fontSize:'0.7rem'}}>{this.state.confirmDestinationError}</p>
                        <div className="btns">
                            <button onClick={this.confirmDestination} className="btn_send">Send</button> <a href="#">Clear all</a>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default content_dashboard
