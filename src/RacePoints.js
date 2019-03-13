import React, { Component } from 'react';
import './RacePoints.css'
import Select from 'react-select';
import StartModal from './StartModal';
import EndModal from './EndModal';

class RacePoints extends Component {
    constructor() {
        super()
        this.state = {
        }
    }

    componentDidMount() {
        this.props.getStations()
            .catch(() => {
                this.props.getStationsFromFirebase();
            })
    }

    render() {
        const { startPoint, endPoint, selectedCheckpoint } = this.state;
        return (
            <section className="RacePoints clearfix">
                <h2 className="racePointsTitle">Race route</h2>
                {this.props.hasCoords ? (
                    <div className="findLocation">
                        <div>
                                <button onClick={this.props.getStationCoords}>Find Nearest Station</button> 
                            {(this.props.nearestStn !== "") ? (
                                <div>
                                    <p>
                                        Your nearest station is: <span>{this.props.nearestStn}</span>
                                    </p>
                                    <button onClick={this.props.randomRace}>Automatically Create Race</button>
                                </div>
                            ) : (<div></div>)}
                            </div>
                    </div>
                        ) : (<div></div>)}
                <div className="addPoints">
                    <h2> {this.props.randomRaceCreated ? (<span>Edit</span>) : (<span>Add</span>)} starting & finish points</h2>
                    <ul>
                        <li>
                            <form className="creatStartEnd">
                                <label className="" htmlFor="startingPoint">{this.props.randomRaceCreated ? (<span>Edit</span>) : (<span>Enter</span>)} Starting Point</label>
                                <Select
                                    defaultValue="Select Start"
                                    name="startingPoint"
                                    value={this.props.value}
                                    onChange={this.props.handleUserStart}
                                    options={this.props.options}
                                />
                                <label className="" htmlFor="endPoint">{this.props.randomRaceCreated ? (<span>Edit</span>) : (<span>Enter</span>)} Finish Line</label>
                                <Select
                                    name="endPoint"
                                    value={this.props.value}
                                    onChange={this.props.handleUserEnd}
                                    options={this.props.options}
                                />
                            </form>
                        </li>
                        <li>
                            <h2>{this.props.randomRaceCreated ? (<span>Edit</span>) : (<span>Add</span>)} race checkpoints</h2>
                            <form className="createCheckPoints" onSubmit={this.props.handleAddCheckPoint}>
                                <label className="" htmlFor="checkPoint">Select Check Points Below</label>
                                <Select
                                    name="selectedCheckpoint"
                                    value={this.state.value}
                                    onChange={this.props.handleUserCheckPoint}
                                    options={this.props.options}
                                    isMulti
                                />
                                <button type="submit">{this.props.randomRaceCreated ? (<span>Edit</span>) : (<span>Add</span>)} Selected Check Points</button>
                            </form>
                        </li>
                    </ul>
                </div> {/*  END OF ADD POINTS */}

                <div className="viewPoints">
                    <h2>Your Race route</h2>
                    <ul>
                        <li>Start:<StartModal filterStart={this.props.userStart}/></li>
                        {
                            this.props.raceArray.map((checkpoint, i) => {
                                return (
                                    <li key={i}>{checkpoint}
                                        <span className="delete" onClick={() => this.props.handleDeleteCheckpoint(i)}><i className="far fa-trash-alt"></i></span>
                                    </li>
                                )
                            })
                        }
                        <li>Finish: <EndModal filterEnd={this.props.userEnd} /></li>
                    </ul>
                </div>
                <div className="submitRace">
                    <button onClick={this.props.scrollResults}>Next</button>

                </div>

            </section>
        );

    }
}
export default RacePoints;
