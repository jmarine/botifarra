function DoubleQuestionBox({multiplier, onDoubleResponse, style}) {

  const cellStyle = {display: "flex", flexDirection: "column", alignItems: "center"};

  return (
    <>
      <div style={{...style, display: "flex", flexDirection: "row", alignItems: "center"}}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "10px", padding: "5px", margin: "5px", backgroundColor: "white" }}>
          <h1><span data-l10n-id={"app.actions.step.double_" + multiplier}>Vols doblar?</span> (x{multiplier*2})</h1>
	  <div>
	    <button data-type="ACCEPT_DOUBLE" onClick={onDoubleResponse} data-l10n-id="app.actions.yes">Si</button>
	    <button data-type="REJECT_DOUBLE" onClick={onDoubleResponse} data-l10n-id="app.actions.no">No</button>
	  </div>
        </div>
      </div>
    </>
  )
}

export default DoubleQuestionBox;

