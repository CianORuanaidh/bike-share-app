import React, { Component } from 'react';
import './styles/Result.css';

class Animation extends Component {

    render(){
        return(
            <div className="bikeAnimation">
                <i class="fas fa-bicycle"></i>
                <p>We are loading the races now...</p>
            </div>
        )
    }
}

export default Animation;