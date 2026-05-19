import Card from '../components/Card'

function TrumpCard({delegate, onTrumpSelection, style}) {

  const cellStyle = {display: "flex", flexDirection: "column", alignItems: "center"};

  return (
    <>
      <div style={{...style, display: "flex", flexDirection: "row", alignItems: "center"}}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "10px", padding: "5px", margin: "5px", backgroundColor: "white"}}>
          <h1 data-l10n-id="app.actions.step.select_trump">Selecciona trumfo:</h1>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "5px" }}>
            <Card type="C" value="1" disabled={false} onCardSelection={onTrumpSelection}/>
            <Card type="O" value="1" disabled={false} onCardSelection={onTrumpSelection}/>
            <Card type="E" value="1" disabled={false} onCardSelection={onTrumpSelection}/>
            <Card type="B" value="1" disabled={false} onCardSelection={onTrumpSelection}/>
            <Card type="BOTIFARRA" value="1" disabled={false} onCardSelection={onTrumpSelection}/>
          </div>
	  {!delegate && (<button data-type="DELEGATE" data-l10n-id="app.actions.step.delegate" onClick={onTrumpSelection} >Delegar</button>)}
        </div>
      </div>
    </>
  )
}

export default TrumpCard

