import React, { Component } from 'react'
import axios from 'axios'
import Loader from "react-loader-spinner";
import gradientBackground from '../logos/grad.jpeg'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../styles/cards.css'
import {store, cards} from '../state/store'


export class Cards extends Component {
    constructor(props){
        super(props)

        this.state = {
            cardNumber: '',
            cardCvv: '',
            cardExp: '',
            apiError: null,
            loading: false,
            cards: [],
            cardLoaded: false,
            cardSwitch: false,
            diplaySwitchIndicator: false
        }

        this.secondsInit = 3000;
        this.fetchCards = this.fetchCards.bind(this)
        this.addCard = this.addCard.bind(this)
    }

    // selectedCard = async () => {
    //     try {
    //         const response  = await axios.get('http://localhost:4000/api/users/cards/selectedCard', {headers: 
    //         {'accept': 'Application/json' , 'x-auth-token': sessionStorage.getItem('token')}})

    //         console.log(response)

    //         if(response.data.selectedCard) {
    //             store.dispatch(cards(response.data.selectedCard,response.data.selectedCardNumber))

    //             //show selected card as marked
    //             console.log(store.getState().selectedCard.cardNumber)s

                

    //         }






    //     } catch (error) {
    //         console.log(error)

    //     }
      



    // }

    componentDidMount(){
        // this.selectedCard()
        this.fetchCards()
        console.log(this.switchedCard())
        
    }

    getFields = (e) =>{
        this.setState({[e.target.name]: e.target.value})

       
        console.log(this.state.cardExp.length)
    }

    fetchCards = async () =>{
        try {
            // await fetching card response
            let response = await axios.get('http://10.0.2.15:3000/api/users/cards', 
             {headers: {'Accept': 'application/json', 'x-auth-token': sessionStorage.getItem('token')}})
            
             console.log(response)
            
            

            //  set cards fetched to the state
            setTimeout(() => {
                if(response) this.setState({cards: response.data,cardLoaded: true})

            }, 3000);
           

        } catch (error) {
            console.log(error)
        }   
        
        console.log('fetching card')
    }

    addCard = async () => {

            this.setState({loading: true})

            // try posting
            let response = await axios.post('http://10.0.2.15:3000/api/users/cards/add', {cvv: this.state.cardCvv, number: this.state.cardNumber, exp:this.state.cardExp},
             {headers: {'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }})

            if(response) this.setState({loading: false})

            // console.log(response)
            
            
            // display errors if theres any
            if(response.data.error) this.setState({apiError: response.data.error})

            if(!response.data.error) this.setState({cards: [response.data,...this.state.cards]})
            
    }

    seeSelectedCard = (card) => {
        if(store.getState().selectedCard.cardNumber == card.cardNumber){


            return {
                // display: 'block',
                border: "1px solid green"
            }
        }
    }

    sub = (text) => {
        let text1 = JSON.stringify(text)

        return text1.substring(12, 16);
    }

    changeCard = async (card) => {

        try {
            const response  = await axios.post('http://10.0.2.15:3000/api/users/cards/switch',
            {updatedCard: card._id, updatedCardNumber: card.cardNumber, updatedCardBalance: card.balance},
            {headers: {'content-type' : 'application/json', 'x-auth-token': sessionStorage.getItem('token')}}
            
             )

            //  if(response)
             const {selectedCard,selectedCardBalance,selectedCardNumber}  = response.data;
             console.log(response) 


            this.addSeconds = this.state.diplaySwitchIndicator === false ?  this.secondsInit : this.secondsInit * 2
            console.log(this.state.diplaySwitchIndicator === true ?  this.addSeconds + this.secondsInit : this.secondsInit)

             store.subscribe(()=>{
                console.log('state changed')
               //  this.seeSelectedCard(card)
               this.setState({cardSwitch: true, diplaySwitchIndicator: true})

               
               setTimeout(() => {
                   this.setState({diplaySwitchIndicator: false})

               }, this.addSeconds );


               document.querySelector('.selectedCard').style.animationName = 'bounceIn'
            })
             store.dispatch(cards(selectedCard,selectedCardNumber,selectedCardBalance))
           
            //  console.log(store.getState())

        } catch (error) {
            console.log(error)
        }
        // console.log('s')

    }

    // let user know they've switched cards
    switchedCard = () => {
        const sc = store.getState().selectedCard.cardNumber.substring(12,16)
        return sc

    }

    render() {
        return (
            <div className="cards_container">
                <div className="cards_inner_container">
                    <div className="cards_header">
                        <h6 style={{margin: '0'}}>Your Cards</h6>
                        <label style={{margin: '0'}} htmlFor="addNewCardBtn">Add new</label>
                        <button className="addNewBtn" onClick={this.addCard} id="addNewCardBtn"><i className="fas fa-plus"></i></button> 
                    </div>
                    <div style={{backgroundImage: `url(${gradientBackground})`, color: 'white'}} className="cardd ">
                        <div className='stack'></div>
                        <div className="card_details_header">
                            <i className="fab fa-cc-visa"></i>
                            <i style={{fontSize: '1rem', cursor: 'pointer'}} className="fas fa-ellipsis-v"></i>
                        </div>
                        <div className="card_details">
                            <input onChange={this.getFields} name='cardNumber' placeholder="Card Number" style={{gridColumn: '1/3'}} className='card_num cardInput' type="number"/>
                            <input onChange={this.getFields} name="cardExp" placeholder="Expiry (Mon/Yr)" className='card_expiry cardInput' type="text"/>
                            <input onChange={this.getFields} name="cardCvv" placeholder="CVV " className='card_cvv cardInput' type="text"/>
                        </div>
                    </div>
                        <p style={{display:  this.state.loading ? 'block' : 'none'}} className="loading"><Loader height='1.5rem' color="gray" type='TailSpin'/></p>
                        <p style={{display:  this.state.apiError ? 'block': 'none'}} className="validation">{this.state.apiError}</p>
                    <div className="cards_created">
                    <Loader style={{textAlign:'center', display: this.state.cardLoaded ? 'none': 'block'}} height='1.5rem' color="gray" type='TailSpin'/>
                        {
                            this.state.cards !== null ? this.state.cards.map(card => (
                                <div onDoubleClick={()=>{this.changeCard(card)}} style={this.seeSelectedCard(card)} key={card._id} className='cards_item'>
                                     <p  style={{justifySelf:'start',fontStyle: 'bold', fontWeight:'900'}} style={{margin: '0'}}> <span className="cardNumber_txt">...{this.sub(card.cardNumber)}</span></p>  <i style={{visibility: store.getState().selectedCard.cardNumber == card.cardNumber ? 'visible' : 'hidden'}} className="fas fa-check selectedCard"></i> <i style={{fontSize: '2rem'}} className="fab fa-cc-visa"></i>
                                </div>
                            )) : <div style={{display: 'grid', justifyItems:'center'}}> <h5 style={{textAlign:'center',color:'gray'}}>No cards available</h5> </div>
                        }
                        
                    
                    </div>
                </div>
                <div style={{display: this.state.diplaySwitchIndicator === true ? 'grid' : 'none'}} className='switchCard'> <span>Switched to</span>  <span className='scn' style={{justifySelf:'end'}}>...{this.switchedCard()}</span></div>
            </div>
        )
    }
}

export default Cards
