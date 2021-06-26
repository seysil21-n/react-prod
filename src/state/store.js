// import {combineReducers,createStore} from 'redux'

const {combineReducers,createStore} = require('redux')

// actions
const cards = (cardID,cardNumber,cardBalance) => {
    return {
        type: 'SELECTED CARD',
        payload: {
            cardNumber,
            cardID,
            cardBalance
        }
    }
}

const globalUser = (User) =>{
    return{
        type: 'SET GLOBAL USER',
        payload: {
            User
        }
    }
}

//reducers
const cardReducer = (state = {cardNumber : '', cardID: '',cardBalance:''}, action) => {
    if(action.type === 'SELECTED CARD'){
        return state ={
            cardNumber: action.payload.cardNumber,
            cardID: action.payload.cardID,
            cardBalance: parseInt(action.payload.cardBalance) 
        }
    }

    return state
}
const User = (state = '', action) => {
    if(action.type === 'SET GLOBAL USER')
    {
        return action.payload.User
    }

    return state
}

const reducers = combineReducers({
    selectedCard : cardReducer,
    User : User
})

const store  = createStore(reducers)

// store.dispatch(cards('113','200'))
// console.log(store.getState())

module.exports = {store, cards,globalUser}

