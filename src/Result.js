import React, { Component } from 'react';
import './styles/Result.css';
import raceEnd from './raceEnd.png'

class RaceInfo extends Component {
    render() {

        return (
            <section className="resultComponent">
                {
                <div className="wrapper">
                        <div className="raceInfo">
                            <div className="container">
                                <h2>Your Race Information <i class="fas fa-bicycle"></i></h2>
                                <h3>Race Name: {this.props.name}</h3>
                                <p>Description: {this.props.description}</p>
                                <div className="racePoints">
                                    <p className="startP"><i class="fas fa-flag-checkered"></i> Starting Point: {this.props.startP}</p>
                                    <p className="checkP">Check Point: 
                                        {
                                            this.props.checkP.map((item)=>{
                                                return <li>{item}</li>;
                                            })
                                        }
                                    </p>
                                    <p className="endP">
                                    <img src={raceEnd} alt="Race Finish Banner"/>
                                     Ending Point: {this.props.endP}</p>
                                    <button onClick={this.props.handleSave} className="save">Save Race</button>
                                </div>
                                <p className="laws"><i className="fas fa-exclamation-triangle"></i> Please obey all traffic laws while participating in a race! <i className="fas fa-exclamation-triangle"></i></p>
                            </div>
                        </div>
                    <button onClick={this.props.handlePrev} className="prevRaces">Show Saved Races</button>
                </div>
                }
            </section>
        );
    }
}

export default RaceInfo
