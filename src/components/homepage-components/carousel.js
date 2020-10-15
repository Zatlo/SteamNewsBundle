import React, {Component} from 'react';
import Carousel from "react-elastic-carousel";
import Car from "./car.PNG";
import styled from 'styled-components';



export default class HomePageCarousel extends Component {
    state = {
        items: [
          {id: 1, title: 'item #1'},
          {id: 2, title: 'item #2'},
          {id: 3, title: 'item #3'},
          {id: 4, title: 'item #4'},
          {id: 5, title: 'item #5'}
        ]
    }

    static getDerivedStateFromProps(props, state){
        return state.items= props.bundleData;

    }


    render(){
        const { items } = this.state;
        return(
            <CarouselContainer>
                <Carousel style={{color: "pink"}}>
                {items.map(item => 
                <div className="carouselMain" key={item.name}>
                    <img alt="car" style={{height: "346.2px", width: "542.4px ", position: "relative", justifyContent: "center", alignItems: "center"}}src={Car}/>
                    <h3 className="carouselImageText">{item.name}</h3>
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


.carouselImageText {
    position: relative; 
    top: -350px; 
    font-size: 40px;
}
`;