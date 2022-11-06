import React from 'react'
import ReviewStar from './reviewStar';

export default class StarsContainer extends React.Component{
    constructor(props){
        super(props)
        this.parent = this.props.parent;
        this.state = {
            index: 5
        }
    }

    render(){
        let stars = this.props.data.map((star,index) => {
            if(!this.parent.state.ratings[star.key] && index == 4) {
                this.parent.state.ratings[star.key] = star.value;
            }
            return <ReviewStar
                rate={index <= this.state.index ? 1: 0}
                parent={this}
                key={index}
                position={index}
                keyStar={star.key}
                value={star.value}
            />
        })
        return stars;
    }
}