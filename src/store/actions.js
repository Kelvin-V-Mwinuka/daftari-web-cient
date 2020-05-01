import * as constants from './const'

export const login = () => {
    return async (dispatch) => {
        // Read user data from local storage, if it's not null, store it to the state
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData !== null) {
            dispatch({
                type: constants.USER_LOGIN,
                payload: userData
            })
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        localStorage.removeItem('user')
        dispatch({
            type: constants.USER_LOGOUT,
            payload: null
        })
    }
}