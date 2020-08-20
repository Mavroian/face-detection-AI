import React, { useState, useEffect} from 'react'
import './Profile.css'
const Profile = ({isProfileOpen, createNotification,toggleModal, user, loadUser}) => {
const [ name, setName ] = useState(user.name)
const [ age, setAge ] = useState(user.age)
const [ pet, setPet ] = useState(user.pet)
const [notification, setNotification] = useState(false)


const onFormChange = (event) => {
  switch (event.target.name) {
    case 'user-name':
      setName(event.target.value)
      break;
    case 'user-age':
      setAge(event.target.value)
      break;
    case 'user-pet':
      setPet(event.target.value)
      break;
    default:
      break;
  }
} 
const sendFormData = (id) => {
  const data = { name, age, pet}
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
return(
  <div className='profile-modal'>
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
      <main className="pa4 black-80 w-100">
        <div className="modal-header">
          <div className="modal-header-avatar">
            <img
                src="http://tachyons.io/img/logo.jpg"
                className="br-100 ba h3 w3 dib" alt="avatar"/>
          </div>
          <div className="modal-header-info">
            <h2>{name}</h2>
            <h5>Images Submitted: {user.entries}</h5>
            <p>Member since: {user.joined}</p>
          </div>
        </div>
        <label className="mt2 fw6" htmlFor="user-name">Name:</label>
        <input
          onChange={onFormChange}
          className="pa2  w-100"
          placeholder={name}
          type="text"
          name="user-name"
          id="user-name"
      />
      <label className="mt2 fw6" htmlFor="user-name">Age:</label>
        <input
          onChange={onFormChange}
          className="pa2  w-100"
          placeholder={age}
          type="text"
          name="user-age"
          id="user-age"
      />
      <label className="mt2 fw6" htmlFor="user-name">Pet:</label>
        <input
          onChange={onFormChange}
          className="pa2  w-100"
          placeholder={pet}
          type="text"
          name="user-pet"
          id="user-pet"
      />
      <div className="mt4" style={{display:'flex', justifyContent:"space-evenly"}}>
        <button className="b pa2 grow hover-white w-40 bg-light-blue b--black-20" onClick={()=> sendFormData(user.id)}>Save</button>
        <button  className="b pa2 grow hover-white w-40 bg-light-red b--black-20" onClick={toggleModal}>Cancel</button>
      </div>
      </main>
      <div className="modal-close" onClick={toggleModal}>&times;</div>
    </article>
  </div>
)
}

export default Profile