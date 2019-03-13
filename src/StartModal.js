import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './styles/Modal.css';

class startModal extends Component {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            stations: [],
            filterStart:'',
            freeBikes:'',
        }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        const stations = this.state.stations;
        const startPoint = this.props.filterStart;
        
        const bikeArr = stations.filter((station)=>{
            return station.name === startPoint;
        });

        const freeBike = bikeArr[0].free_bikes;
        
        this.setState({ 
                modalIsOpen: true,
                freeBikes: freeBike
            });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    getStations = () => {
        
    }

    componentDidMount() {
        axios({
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
        })
    }


    render() {
        return (
            <div>
                <button onClick={this.openModal}>{this.props.filterStart}</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modalContent">
                        <h2>Real-time availability of bikes</h2>
                        <p>At this station: {this.props.filterStart} there are {this.state.freeBikes} bikes left</p>
                    </div>
                    <button className="closeModal" onClick={this.closeModal}>close</button>
                </Modal>
            </div>
        )
    }

}



export default startModal;