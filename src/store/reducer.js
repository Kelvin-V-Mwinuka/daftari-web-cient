import * as constants from './const'
import { combineReducers } from 'redux'

const initial_state = {
    base_url: process.env.REACT_APP_BASE_URL
}

const generalReducer = (state=initial_state, action) => {
    switch(action.type){
        default:
            return state
    }
}

const rootReducer = combineReducers({
    general: generalReducer
})

export default rootReducer