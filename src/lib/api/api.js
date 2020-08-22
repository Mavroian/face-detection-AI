
 export const signOutApiCall = (onRouteChange) => {
  const token = window.sessionStorage.getItem('token')
    if (token) {
      fetch('http://localhost:3000/signout', {
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
  fetch(`http://localhost:3000/profile/${id}`, {
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

