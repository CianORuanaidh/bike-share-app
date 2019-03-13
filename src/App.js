import React, { Component } from 'react';
import firebase from './firebase.js';
import RacePoints from './RacePoints.js';
import NameDesc from './NameDesc.js';
import Result from './Result.js';
import PrevRaces from './PrevRaces.js';
import './styles/Setup.css';
import './styles/Header.css';
import scrollToComponent from 'react-scroll-to-component';
import swal from '@sweetalert/with-react';
import axios from 'axios';
import UserPrevRace from './UserPrevRace.js';
import logo from './logo.png';
// import RandomRace from './RandomRace.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      stations: [],
      name: '',
      description: "",
      race: {
        startPoint: '',
        endPoint: '',
        selectedCheckpoint: [],
        raceArray: [],
        newRaceArray: [],
        timeCreated: ''
      },
    options: [],
    view: true,
    user: null,
    authID: '',
    longitude: '',
    latitude: '',
    hasCoords: false,
    nearestStn: "",
    nearestHundred: [],
    randomRaceCreated: false
    }
  }

  componentDidMount() {
    this.getLocation()
  }

  //API call
  getStations = () => {
    return axios({
        method: 'GET',
        url: 'https://api.citybik.es/v2/networks/toronto',
        dataResponse: 'json'
    })
        .then((response) => {
            const stations = response.data.network.stations;
            const stationArr = [];
            stations.forEach((item) => {
                stationArr.push(item);
            })
            this.setState({
                stations: stationArr
            })

            console.log('AXIO succed')
            let stationsOptions = stationArr.map((station) => {
                return {
                    label: station.name,
                    value: station.name
                }
            })

            this.setState({
                options: stationsOptions
            });

        })
  }

  //PlanB, fetch data from firebase
  getStationsFromFirebase = () => {
      console.log('plan B');
      const dbRef = firebase.database().ref();
      dbRef.on('value', res => {
          const data = res.val();
          const temArr = [];

          for (let key in data) {
              temArr.push(data[key])
          }

          const stationsObj = temArr[0];

          let stationsOptions = stationsObj.map((station) => {
              return {
                  label: station.name,
                  value: station.name
              }
          })

          this.setState({
              options: stationsOptions
          });
      })
  }
  
  //updatestate from user input
  upDateName = (e) => {
    const userName = e.target.value
    this.setState({
      name: userName
    })
  }

  upDateDesc = (e) => {
    const userDesc = e.target.value
    this.setState({
      description: userDesc
    })
  }

  //update state from user select
  handleStartChange = (event) => {
    this.setState({
      race:
      {
        ...this.state.race,
        startPoint: event.label
      }
    });
  }


  handleEndChange = (event) => {
    this.setState({
      race:
      {
        ...this.state.race,
        endPoint: event.label
      }
    });
  }

  handleCheckPointChange = (event) => {
    console.log(event);
    this.setState({
      race:
      {
        ...this.state.race,
        newRaceArray: event,
      }
    });
  }

  addCheckPoint = (event) => {
    event.preventDefault();
    let changeArray = [];
    this.state.race.newRaceArray.forEach((checkpoint)=>{
      changeArray.push(checkpoint.label);
    });
    console.log(changeArray);
    this.setState({
      race:
      {
        ...this.state.race,
        raceArray: changeArray
      }
    });
  }

  deleteCheckpoint = (index) => {
    swal({
      title: "Are you sure?",
      text: `Do you want to delete the ${this.state.race.raceArray[index]} checkpoint`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let changeArray = this.state.race.raceArray;
        changeArray.splice(index, 1);
        this.setState({
          race:
          {
            ...this.state.race,
            raceArray: changeArray
          }
        });
      } else {
        swal("Your checkpoint is safe!");
      }
    });
  }

  // handel save button clicked - with both gust login and auth user login

  handleSaveRace = (event) => {
    event.preventDefault();
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();

    let timeCreated = `${month}-${day}-${year} ${hour}:${minute}`;
    
    const savedRace = {
      name: this.state.name,
      description: this.state.description,
      startPoint: this.state.race.startPoint,
      endPoint: this.state.race.endPoint,
      selectedCheckpoint: this.state.race.raceArray,
      timeCreated: timeCreated
    }

    let dbRef;
    if(this.state.user){
      const authID = this.state.authID;
      dbRef = firebase.database().ref(`authUsers/${authID}`);
    }else{
      dbRef = firebase.database().ref();
    }

    if (savedRace.name && savedRace.description && savedRace.startPoint && savedRace.endPoint) {
      dbRef.push(savedRace);
      this.setState({
        name: '',
        description: "",
        race: {
          startPoint: '',
          endPoint: '',
          selectedCheckpoint: [],
          raceArray: [],
          timeCreated:''
        },
        view:null
      })
    } else {
      swal('Please make sure you have entered a race name and description, and have selected a station for your "start" and "finish" locations.')
    }

    this.setState({
      randomRaceCreated: false
    });

  }

  // handle previous button clicked
  handlePrevRace = (event) => {
    event.preventDefault();
    this.setState({
      view: null
    })
  }

  // handle home button clicked
  handleHome = (event) => {
    event.preventDefault();
    this.setState({
      view: true
    })
  }

  //smooth scroll
  scrollND = () => {
    scrollToComponent(this.NameDesc)
  }
  scrollRP = () => {
    scrollToComponent(this.RacePoints)
  }
  scrollRes = () => {
    scrollToComponent(this.Result)
  }

  // Random Race functions
  getLocation = () => {
    // console.log("getLocation RAAANNN");
    navigator.geolocation.getCurrentPosition((location) => {
        if (location.coords) {
            let lat = location.coords.latitude;
            let long = location.coords.longitude;
            console.log(lat, long)
            this.setState({
                longitude: long,
                latitude: lat,
                hasCoords: true
            }, () => {
                console.log(this.state, "this is the state")
            })
        }
    })
  }


  //API call
  getStationCoords = () => {
    return axios({
        method: 'GET',
        url: 'https://api.citybik.es/v2/networks/toronto',
        dataResponse: 'json'
    })
        .then((response) => {
            console.log(response.data.network.stations, "this is the response data stations");
            const stations = response.data.network.stations;
            const stationCoordsArr = [];
            const totalDist = [];
            stations.forEach((station) => {
                // console.log(this.state.latitude);

                let latDist = Math.abs(station.latitude - this.state.latitude);
                let lngDist = Math.abs(station.longitude - this.state.longitude);
                let totDist = latDist + lngDist;
                let stn = {
                    name: station.name,
                    totalDist: totDist
                }

                totalDist.push(stn)
            })
            totalDist.sort(function (a, b) {
                return a.totalDist - b.totalDist
            })
            console.log(totalDist, "this is the totalDist array");
            let nearStn = totalDist[0].name;
            let nearestHund = totalDist.splice(1, 100);
            console.log(nearestHund, "this is the nearest hundred");
            console.log(nearStn, "this is the nearest station");
            this.setState({
                nearestStn: nearStn,
                nearestHundred: nearestHund,
            })
            console.log(this.state, "this is the current state - Gus")

        })
  }

  randomRace = () => {
    let startPoint = this.state.nearestStn;
    console.log(startPoint);
    let finish = this.state.nearestHundred[99].name;
    let checkOneRand = Math.floor(Math.random() * 20);
    let checkTwoRand = Math.floor(Math.random() * 20) + 20;
    let checkThreeRand = Math.floor(Math.random() * 20) + 40;
    let checkFourRand = Math.floor(Math.random() * 20) + 60;
    let checkFiveRand = Math.floor(Math.random() * 20) + 79;
    let checkOne = this.state.nearestHundred[checkOneRand].name;
    let raceArray = [];
    raceArray.push(this.state.nearestHundred[checkOneRand].name);
    raceArray.push(this.state.nearestHundred[checkTwoRand].name);
    raceArray.push(this.state.nearestHundred[checkThreeRand].name);
    raceArray.push(this.state.nearestHundred[checkFourRand].name);
    raceArray.push(this.state.nearestHundred[checkFiveRand].name);
    if (checkOne !== "") {
        this.setState({
            randomRaceCreated: true,
            race:
            {
              ...this.state.race,
              raceArray: raceArray,
              startPoint: startPoint,
              endPoint: finish
            }
        }, () => {
            console.log(this.state, "this is thd state with race points")
        })
    }
  }


  //user authentication
  login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        const userID = user.uid
        this.setState({
          user: true,
          authID: userID
        });
      });
  }

  logout = () => {
    const auth = firebase.auth();
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  render() {
    if (this.state.view) {
      return (
        <div className="App">
          <header className="headerContent">
            <nav className="headerNav clearfix">
              <h2 className="logo"><span className="t">T</span><img src={logo} alt="Toronto bike share logo." /> Bike Share Races</h2>
              <ul className="headerList clearfix">
                <li className="home"><a href="#">Home</a></li>
                <li className="prevRaces" onClick={this.handlePrevRace}><a href="#">Previous Races</a></li>
              </ul>
            </nav>
            <div className="hamburgerMenu">
              <nav className="hamNav">
                  <h2 className="logo"><span className="t">T</span><img src={logo} alt="Toronto bike share logo." /> Bike Share Races</h2>
                  <input className="hamburgerOpen" id="toggleOpen" type="checkbox" name="toggle" />
                    <label htmlFor="toggleOpen">
              
                      <i class="fa fa-bars"></i>
                    </label>
                    <ul className="hamburgerList">
                      <label htmlFor="toggleOpen" class="hamburgerClose">
                        <i class="fas fa-times"></i>
                      </label>
                    <li className="home"><a href="#">Home</a></li>
                    <li className="prevRaces" onClick={this.handlePrevRace}><a href="#">Previous Races</a></li>
                    </ul>
              </nav>    
            </div>
            <h1>Welcome to Toronto Bike Share Races</h1>
            <button className="createRaceBtn" onClick={this.scrollND}>Create Race</button>
            {
              this.state.user ? 
            <button className="logout" onClick={this.logout}>Log Out</button>
            : <button className="login" onClick={this.login}>Login</button>
            }
            {
              this.state.user ?
                <button className="createRaceBtn" onClick={this.scrollND}>Create Race</button>
                : <button className="createRaceBtn" onClick={this.scrollND}>Create Race As Guest</button>
            }
          </header>
  
          <NameDesc 
          takeName={this.upDateName} 
          takeDesc={this.upDateDesc}
          
          name={this.state.name}
          description={this.state.description} 
          ref={(component) => { this.NameDesc = component; }}
          scrollRacePoints={this.scrollRP}
          handlePrev={this.handlePrevRace}
          />

          <RacePoints
            options = {this.state.options}
            getStations = {this.getStations}
            getStationsFromFirebase = {this.getStationsFromFirebase}
            handleOptionChange={this.handleOptionChange}
            handleUserStart={this.handleStartChange}
            handleUserEnd={this.handleEndChange}
            handleUserCheckPoint={this.handleCheckPointChange}
            handlePrev={this.handlePrevRace}

            handleAddCheckPoint={this.addCheckPoint}
            handleDeleteCheckpoint={this.deleteCheckpoint}

            userStart={this.state.race.startPoint}
            userEnd={this.state.race.endPoint}
            userCheckPoint={this.state.race.selectedCheckpoint}
            raceArray={this.state.race.raceArray}

            scrollResults={this.scrollRes}
            ref={(component) => { this.RacePoints = component; }}

            getLocation = {this.getLocation}
            longitude = {this.state.longitude}
            latitude = {this.state.latitude}
            hasCoords = {this.state.hasCoords}
            nearestStn = {this.state.nearestStn}
            nearestHundred = {this.state.nearestHundred}
            checkOne = {this.state.checkOne}
            checkTwo = {this.state.checkTwo}
            checkThree = {this.state.checkThree}
            finish = {this.state.finish}
            randomRace = {this.randomRace}
            getStationCoords = {this.getStationCoords}
            randomRaceCreated = {this.state.randomRaceCreated}
          />

          <Result
            name={this.state.name}
            description={this.state.description}
            startP={this.state.race.startPoint}
            endP={this.state.race.endPoint}
            checkP={this.state.race.raceArray}
            user={this.state.user}

            handleSave={this.handleSaveRace}
            handlePrev={this.handlePrevRace}
            ref={(component) => { this.Result = component; }}
          />
        </div>
      );
    } else {
      if (this.state.user) {
        return <UserPrevRace
          authID={this.state.authID}
          handleBack={this.handleHome}
        />
      } else {
        return <PrevRaces 
          handleBack={this.handleHome} 
          />
      }
    }
  }
}

export default App;
