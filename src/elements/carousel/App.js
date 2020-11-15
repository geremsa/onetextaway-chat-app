import React from 'react';
import Carousel from './c';

function App() {
    const Irray = [
        "https://cdn.pixabay.com/photo/2020/05/24/06/54/dumbo-5212670_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/10/27/07/40/cheetah-5689870__480.jpg",
        "https://cdn.pixabay.com/photo/2020/10/29/05/02/buddhist-5695220__480.jpg",
        "https://cdn.pixabay.com/photo/2020/10/21/19/43/jack-o-lanterns-5674148__480.jpg"
      ];
    return (
        <div>
            <Carousel Irray={Irray} />
        </div>
    )
};


export default App
