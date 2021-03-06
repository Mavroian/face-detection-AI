import React, { Component } from 'react';
import Particles from 'react-particles-js';
import moment from 'moment'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal'
import Profile from './components/Profile/Profile'
import Loading from './components/Loading/Loading'
import { backend_API } from './lib/utils/constants';
import 'react-notifications/lib/notifications.css';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  isLoading:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    age:'',
    pet:'',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  componentDidMount = () => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
     this.handleLoading(true)
      fetch(`${ backend_API }/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => res.json())
      .then( data => {  
        if (data && data.id ){
         fetch(`${ backend_API }/profile/${data.id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
         })
          .then(res =>  res.json())
          .then(user => {
            if(user && user.email){
              this.loadUser(user)
              this.onRouteChange('home')
              this.handleLoading(false)
            }
          })
        } 
      }).catch(error =>  console.log(error))
    }
  }
  createNotification = (type, message) => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success(type);
          break;
        case 'warning':
          NotificationManager.warning(message, 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error(message,type, 5000, () => {
            alert('callback');
          });
          break;
        default:
          break;
      }
  };
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: moment(new Date(data.joined)).format('LL'),
      age: data.age,
      pet: data.pet,
    }})
  }
  toggleModal = ()=> {
    this.setState((prevState)=>({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0]
      .data.regions.map(regions => regions.region_info.bounding_box);
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return clarifaiFace.map(box => {
          return {
            leftCol: box.left_col * width,
            topRow: box.top_row * height,
            rightCol: width - (box.right_col * width),
            bottomRow: height - (box.bottom_row * height)
          }
      })
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: [...boxes]});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    const token = window.sessionStorage.getItem('token')
    this.setState({boxes:[]})
    this.setState({imageUrl: this.state.input});
      fetch(`${ backend_API }/imageurl`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${ backend_API }/image`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  handleLoading = (loading) => {
    this.setState({ isLoading: loading })
  }
  render() {
    const { isSignedIn, imageUrl, route, boxes, user} = this.state;
    return (
      <div className="App">
         <Particles className='particles'
           params={{
            "particles": {
                "number": {
                    "value": 80
                },
                "size": {
                    "value": 3
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    }
                }
            }
          }}
        />
        <Navigation   toggleModal={this.toggleModal} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          this.state.isProfileOpen &&
            <Modal>
              <Profile 
                createNotification={this.createNotification}
                loadUser={this.loadUser}
                toggleModal={this.toggleModal}
                isProfileOpen={this.state.isProfileOpen}
                user={user}
                />
            </Modal>
        }
        { route === 'home'? 
            <div>
             
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
                <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin' ? 
                ( 
                  !this.state.isLoading ?
                    <Signin handleLoading={this.handleLoading} loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    :
                    <Loading/>
                )
                
             :  
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
        <NotificationContainer/>
      </div>
    );
  }
}

export default App;
