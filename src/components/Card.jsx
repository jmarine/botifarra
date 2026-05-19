import { useState, useEffect, useRef, Button } from 'react'

function Card({index, type, value, disabled, onCardSelection, style}) {
  let cardWidth = 208;
  let cardHeight = 319;

    const [width, setWidth] = useState(cardWidth);
    const [height, setHeight] = useState(cardHeight);

    const div = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            // Depending on the layout, you may need to swap inlineSize with blockSize
            // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
            setWidth(event[0].contentBoxSize[0].inlineSize);
            setHeight(event[0].contentBoxSize[0].blockSize);
	    console.log("width: " + width + ", height: " + height);
        });

        resizeObserver.observe(div.current);
    });

  let ivalue = 0;
  switch(value.toUpperCase()) {
	  case "J":
	  case "S":
	  case "JACK":
	  case "SOTA": 
		  ivalue = 9; 
		  break;
	  case "Q": 
	  case "C": 
	  case "QUEEN": 
	  case "CABALLO": 
		  ivalue = 10; 
		  break;
	  case "K": 
	  case "R": 
	  case "KING": 
	  case "REY": 
		  ivalue = 11; 
		  break;
          default: 
		  ivalue = parseInt(value)-1; 
		  break;
  }


  let itype = 0;
  switch(type.toUpperCase()) {
	  case "S": 
	  case "SPADES": 
	  case "O":
	  case "OROS": 
		  itype = 0; 
		  break;
	  case "D": 
	  case "DIAMONDS": 
	  case "C": 
	  case "COPAS": 
		  itype = 1; 
		  break;
	  case "L":
	  case "CLUBS": 
	  case "E": 
	  case "ESPADAS": 
		  itype = 2; 
		  break;
	  case "H": 
	  case "HEARTS": 
	  case "B": 
	  case "BASTOS": 
		  itype = 3; 
		  break;
	  case "NO-TRUMP":
	  case "BOTIFARRA":
	  case "BUTIFARRA":
	  case "EMPTY": 
                  itype = 4;
                  ivalue = 0;
                  break;
	  case "BACK": 
	  case "DORSO": 
		  itype = 4; 
		  ivalue = 1; 
		  break;
	  case "JK": 
	  case "JKR": 
	  case "JOKER": 
	  case "JOKERCOLOR": 
                  itype = 4;
                  ivalue = 2;
                  break;
	  case "JKB": 
	  case "JKRB": 
	  case "JOKERB": 
                  itype = 4;
                  ivalue = 3;
                  break;
	  case "JKBW": 
	  case "JKRW": 
	  case "JOKERW": 
                  itype = 4;
                  ivalue = 4;
                  break;

  }



  let xoffset = -ivalue * cardWidth - 0;
  let yoffset = -itype * cardHeight - 0;
  let imageOffset = "" + xoffset + "px " + yoffset + "px";
  let scale = "scale(" + Math.min(width/cardWidth, height/cardHeight) + ")";

  return (
    <>
	<div ref={div} className="card" style={{ transform: scale, transformOrigin: "top left", ...style }} >
	<button className="cardImage" disabled={disabled} onClick={onCardSelection} style={{ backgroundPosition: imageOffset }} data-type={type} data-value={value} data-index={index} > 
	</button>
	</div>
    </>
  )
};

export default Card;

