import { serverUrl } from '../../constants';

export const LOGIN = 'LOGIN';
// export const PROFILE_REQUEST = 'PROFILE_REQUEST';
// export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
// export const PROFILE_FAIL = 'PROFILE_FAIL';

export function login(user) {
    return {
        type: LOGIN,
        user: user,
    }
};


// export function profileRequest(user) {
//     return (dispatch) => {
//         return fetch(`${serverUrl}rest-auth/login/`, {
//                     method: 'POST',
//                     body: JSON.stringify({usernae: username, password: password}),
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 })
//                     .then(response => {
//                         dispatch(profileSuccess({username:username, token:response.key}))
//                     })
//                     .catch(err => {
//                         dispatch(profileFail(err))
//                     })
//     }
// }

// export function loginSuccess(user) {
//     return (dispatch) => {
//         return fetch(`${}`)
//     }
// }