import React, { Component } from 'react';
import firebase from './firebase.js';
import Animation from './Animation.js';
import './styles/PrevRaces.css';
import raceEnd from './raceEnd.png';
import logo from './logo.png';
import swal from '@sweetalert/with-react';

class UserPrevRace extends Component {
    constructor() {
        super()
        this.state = {
            saved: [],
            races: [],
            view: null,
            timeTrack: {},
            currentTrack: {}
        }
    }

    componentDidMount() {
        const authID = this.props.authID
        const itemsRef = firebase.database().ref(`authUsers/${authID}`);
        itemsRef.on('value', (saved) => {
            let newRace = [];
            let newTime = [];

            const data = saved.val();
            for (let key in data) {
                newRace.push(
                    {key:key,
                    ...data[key]
                    }
                    );

                newTime.push(
                    {
                        key: key,
                        startTime: '',
                        checkTime: [],
                        endTime: '',
                        length: '' 
                    }
                )
            }
            const updateRaces = newRace.reverse();

            this.setState({
                saved: updateRaces,
                races: updateRaces,
                timeTrack: newTime
            })

            setTimeout(this.showRaces, 1500);
        })
    };

    showRaces = () => {
        this.setState({
            view: true
        })
    };

    sortByNums = () => {
        const races = this.state.saved;
        const noCheckpoint = [];
        const hasCheckpoint = [];

        races.forEach((race) => {
            if (race.selectedCheckpoint) {
                hasCheckpoint.push(race);
            } else {
                noCheckpoint.push(race);
            }
        })

        hasCheckpoint.sort((raceA, raceB) => {
            return raceB.selectedCheckpoint.length - raceA.selectedCheckpoint.length;
        })

        const newSortedRaces = hasCheckpoint.concat(noCheckpoint);
        this.setState({
            saved: newSortedRaces
        })
    }

    sortByTime = () => {
        this.setState({
            saved: this.state.races
        })
    }


    render() {
        if (this.state.view) {
            return (
                    <section className="prevRacesComponent">
                    <header className="headerContent">
                            <nav className="headerNav clearfix">
                            <h2 className="logo"><span className="t">T</span><img src={logo} alt="Toronto bike share logo." /> Bike Share Races</h2>
                                <ul className="headerList clearfix">
                                    <li className="home"><a onClick={this.props.handleBack} href="#">Home</a></li>
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
                                            <li className="home"><a onClick={this.props.handleBack} href="#">Home</a></li>
                                            <li className="prevRaces" onClick={this.handlePrevRace}><a href="#">Previous Races</a></li>
                                        </ul>
                                </nav>    
                            </div>
                        </header>
                        <h2 className="prevRaceTitle">Here Are Your Previous Races <i class="fas fa-bicycle"></i></h2>
                        <button className="sortButton" onClick={this.sortByNums}>Sort By Checkpoints</button>
                        <button className="sortButton" onClick={this.sortByTime}>Sort By Created Time</button>
                        <div className="savedRacesContainer clearfix">
                            {
                                this.state.saved.map((races) => {
                                    return (
                                        <div className="savedRaces">
                                            <p>Created at: {races.timeCreated}</p>
                                            <h3>Race Name: {races.name}</h3>
                                            <p>Description: {races.description}</p>
                                            <p><i class="fas fa-flag-checkered"></i> Startpoint: {races.startPoint}</p>
                                            <ul>
                                                {races.selectedCheckpoint ?
                                                    races.selectedCheckpoint.map((checkpoint) => {
                                                        return <li>{checkpoint}</li>
                                                    })
                                                    : null}
                                            </ul>
                                            <p><img src={raceEnd} alt="Race Finish Banner" /> Endpoint: {races.endPoint}</p>
                                        </div>
                                    )
                                })

                            }
                        </div>
                    </section>
            )
        } else {
            return <Animation />;
        }
    }
}

export default UserPrevRace