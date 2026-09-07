function FlowStatus({spectator, status, turn, slotOffset, step, style}) {

  let message = false;
  if(status == "") {
     message = "Connect to WGS server and select game";
  } else if(status == "FINISHED") { 
     message = "Game over";
  } else if(status == "OPEN") {
     message = "Waiting players to press ready & game start";
  } else if(spectator) {
     message = "Spectating game";
  } else if(turn == slotOffset) {
     if(step == "play") message = "Waiting for your turn";
  } else {
     if( (turn % 2) == (slotOffset % 2) ) message = "Waiting pair turn";
     else message = "Waiting opponent turn";
  }

  return message && (
    <>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "top"}}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "10px", padding: "5px", margin: "5px", backgroundColor: "white"}}>
          <h1>{message}</h1>
        </div>
      </div>
    </>
  )
}

export default FlowStatus;

