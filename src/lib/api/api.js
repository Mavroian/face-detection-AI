
 import { backend_API } from '../utils/constants';

 export const signOutApiCall = (onRouteChange) => {
  const token = window.sessionStorage.getItem('token')
    if (token) {
      fetch(`${backend_API}/signout`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => res.json())
      .then( () => {  
        window.sessionStorage.removeItem('token')
        onRouteChange('signout')
      }).catch(error =>  console.log(error))
    }else {
      onRouteChange('signin')
    }
}
export const updateProfileApi = (
  id,
  data,
  loadUser,
  toggleModal,
  createNotification,
  user
  ) => {
  const token = window.sessionStorage.getItem('token')
  fetch(`${backend_API}/profile/${id}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({formInput: data})
  })
    .then(response => {
      toggleModal()
      loadUser({...user, ...data})
      return response.json()
    })
    .then(res => {
      createNotification(res, res)
    }).catch(error=> {
      createNotification(error)
    })
}

