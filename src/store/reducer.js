import * as constants from './const'
import { combineReducers } from 'redux'

const initial_state = {
    base_url: 'http://localhost:8000'
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