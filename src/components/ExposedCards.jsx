import Card from '../components/Card'

function ExposedCards({exposedCards, slotOffset, onCardSelection, style}) {

  const cellStyle = {display: "flex", flexDirection: "column", alignItems: "center"};

  return exposedCards && (
    <>
<div style={{...style, display: "flex", flexDirection: "row", alignItems: "center"}}>
  <div style={cellStyle}>
      <Card type={exposedCards[(3+slotOffset) % 4].type} value={exposedCards[(3+slotOffset) % 4].value} disabled={true} onCardSelection={onCardSelection}>
      </Card>
  </div>

  <div style={cellStyle}>
      <Card type={exposedCards[(2+slotOffset) % 4].type} value={exposedCards[(2+slotOffset) % 4].value} disabled={true} onCardSelection={onCardSelection}>
      </Card>
      <Card type={exposedCards[(0+slotOffset) % 4].type} value={exposedCards[(0+slotOffset) % 4].value} disabled={true} onCardSelection={onCardSelection}>
      </Card>
  </div>

  <div style={cellStyle}>
      <Card type={exposedCards[(1+slotOffset) % 4].type} value={exposedCards[(1+slotOffset) % 4].value} disabled={true} onCardSelection={onCardSelection}>
      </Card>
  </div>
</div>

    </>
  )
}

export default ExposedCards

