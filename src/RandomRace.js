import React, { Component } from 'react';
import axios from 'axios';
import { posix } from 'path';


class RandomRace extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
        this.props.getLocation()
    }

    render() {
        return (
            <div>
                {this.props.hasCoords ? (
                <div>
                    <button onClick={this.props.getStationCoords}>Find nearest station</button> 
                    <h2>Your nearest station is: {this.props.nearestStn}</h2><button onClick={this.props.randomRace}>Random Race</button>
                    <h2>Your random race is:</h2>
                    </div>) : (<div></div>)}
            </div>
        )
    }

}


export default RandomRace;
