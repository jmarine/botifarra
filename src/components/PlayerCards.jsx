import Card from '../components/Card'

function ExposedCards({cards, onCardSelection}) {

  let mountedCards = cards || [];

  let cardsDOM = mountedCards.map( (item, i) => (
	  <Card key={i} index={i} type={item.type} value={item.value} disabled={false} onCardSelection={onCardSelection} style={{maxWidth: "105px", flexShrink: 1, marginRight: "-50px"}} />
  ));

  const onTouch = function(event) {
    var found = false;
    if(event.touches != null && event.touches.length > 0) {
	  var x = event.touches[0].clientX; // - event.currentTarget.offsetLeft;
	  var y = event.touches[0].clientY; // - event.currentTarget.offsetTop;
	  console.log("ontouchstart: x=",x,",y=",y);
	  var childs = $(event.currentTarget).find("div.card");
	  for(var i = childs.length-2; i >= 0; i--) {
		  var child = childs.get(i);
		  console.log("child " + i + " x=" + child.offsetLeft);
		  if(!found && x >= child.offsetLeft  && x <= child.offsetLeft + child.offsetWidth - 1) {
			  console.log("cardTouch class added to child=" + i);
			  $(child).addClass("cardTouch");
			  found = true;
		  } else {
			  $(child).removeClass("cardTouch");
		  }
	  }

	  if(event.cancelable) 
	  {
	    event.preventDefault();
	  }
          event.stopPropagation();
    }
    return true;
  };

  const onTouchEnd = function(event) {
	  let target = event.currentTarget;
	  setTimeout(function() { $(target).find("div.card").removeClass("cardTouch"); }, 1000);
  };

  return cards && (
    <>
    <div className="playerHand" style={{ alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, justifyContent: "space-evenly", passive: "false", touchAction: "none" }} onTouchStart={onTouch} onTouchMove={onTouch} onTouchEnd={onTouchEnd}>
	  {cardsDOM}
	  <div style={{width: "50px"}}></div>
      </div>
    </div>
    </>
  )
}

export default ExposedCards

