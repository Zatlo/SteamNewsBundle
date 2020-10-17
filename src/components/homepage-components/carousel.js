import React, {Component} from 'react';
import Carousel from "react-elastic-carousel";
import Car from "./webcar.png";
import styled from 'styled-components';
import { Link } from "react-router-dom";




export default class HomePageCarousel extends Component {
    state = {
        items: [
          {name: 1, description: 'loading...'},
          {name: 2, description: 'loading...'},
          {name: 3, description: 'loading...'},
          {name: 4, description: 'loading...'},
          {name: 5, description: 'loading...'}
        ]
    }

    static getDerivedStateFromProps(props, state){
        //console.log(props.bundleData);
        return state.items= props.bundleData;

    }


    render(){
        const { items } = this.state;
        return(
            <CarouselContainer>
                <Carousel style={{color: "pink"}}>
                {items.map(item => 
                <div key={item._id}>
                <Link to={{pathname:"/public/bundle/"+item._id}} className="carouselMain">
                    <img alt="car" style={{height: "346.2px", width: "542.4px ", position: "relative", justifyContent: "center", alignItems: "center"}}src={Car}/>
                    <h3 className="carouselImageText">{item.name}</h3>
                    <h3 className="carouselLikeNum">{item.likes}</h3>                   
                </Link>
                <p>{item.description}</p>
                </div>)}
                
                </Carousel>
            </CarouselContainer>
        )
    }

}

const CarouselContainer = styled.footer`

div.rec-carousel{
    width: 60%;
}

button.rec-dot{
    background-color: rgb(209, 109, 201, 0.356);
    outline: none;
    border: none;
    border-radius: 0%;
}
  

button.rec-arrow{
    height:100%;
    border-radius: 0%;
    background-color: rgba(0, 0, 0, 0.5);
    background: none;
    border: none;
    outline: none;
}

button.rec-arrow:active{
    background-color: rgb(209, 109, 201, 0.356);
}
button.rec-arrow:focus{
    background-color: rgb(209, 109, 201, 0.356);
}


button.rec-arrow:hover{
    background-color: rgb(209, 109, 201, 0.356);
}

.carouselLikeNum{
    top: 300px;
    position: absolute !important;
    display: block !important;
    bottom: 0px;
    width: 37%;
    color: pink;
}
.carouselImageText {
    top: 10px;
    position: absolute !important;
    display: block !important;
    bottom: 0px;
    width: 20%;
    color: pink;
}
`;