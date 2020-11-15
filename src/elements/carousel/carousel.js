import React, {useState, useEffect, useCallback} from "react";

import "./carousel.css";

const Carousel = ({Irray}) => {


  const [current, setcurrent] = useState(0)
  const next = useCallback(()=>{
    setcurrent(c=>
    c===Irray.length-1? 0:c+1
      );
  },[Irray.length]);
  const goTo =(i)=>{
    setcurrent(i);
  }
  let x;
  useEffect(()=>{
   x = setTimeout(() => {
      next();
    }, 3000);
  })

  

  if (!Array.isArray(Irray) || Irray.length <= 0) {
    return null;
  }

  return (
    <>
      <section className="carousel-container">
        <div className="carousel-slider">
          {Irray.map((e, i) => (
            <>
            <img key={"c-" + i} src={e} className={`carousel-image ${current===i? "active" : "notactive"}`} id={"pic" + i}/>
            <img key={"c-x" + i} src={e} className={`carousel-image pseudo ${current===i? "notactive" : "active aa"}`} id={"pic" + i}/>
            </>
          ))}
        </div>
        <div className="indicator">
        <span className={`${current===0?"iac":""}`}onClick={()=>{clearTimeout(x); goTo(0)}}>A</span>
        <span className={`${current===1?"iac":""}`}onClick={()=>{clearTimeout(x); goTo(1)}}>B</span>
        <span className={`${current===2?"iac":""}`}onClick={()=>{clearTimeout(x); goTo(2)}}>C</span>
        <span className={`${current===3?"iac":""}`}onClick={()=>{clearTimeout(x); goTo(3)}}>D</span>
        </div>
      </section>
    </>
  );
};
export default Carousel;
