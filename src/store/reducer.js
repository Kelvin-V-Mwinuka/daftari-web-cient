import * as constants from './const'
import { combineReducers } from 'redux'

const general_state = {
    base_url: process.env.REACT_APP_BASE_URL,
}

const user_state = {
    user: null,
}

const generalReducer = (state=general_state, action) => {
    switch(action.type){
        default:
            return state
    }
}

const userReducer = (state=user_state, action) => {
    switch(action.type){
        case constants.USER_LOGIN:
            return {...state, user: action.payload };
        case constants.USER_LOGOUT:
            return {...state, user: action.payload};
        case constants.USER_REGISTER:
            break;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    general: generalReducer,
    user: userReducer
})

export default rootReducer