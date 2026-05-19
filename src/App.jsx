import { useState, useRef, useEffect, createContext, useContext } from 'react'

import Card from './components/Card'
import ExposedCards from './components/ExposedCards'
import TrumpCard from './components/TrumpCard'
import PlayerCards from './components/PlayerCards'
import DoubleQuestionBox from './components/DoubleQuestionBox'
import FlowStatus from './components/FlowStatus'

import './App.css'


function App() {

  const dorso = { "type": "DORSO", "value": "1" };

  const [spectator, setSpectator] = useState(false);

  const [state, setState] = useState("");

  const [scores, setScores] = useState([0, 0]);

  const [turn, setTurn] = useState(-1);

  const [step, setStep] = useState("none");

  const [delegate, setDelegate] = useState(false);

  const [trump, setTrump] = useState(dorso);

  const [multiplier, setMultiplier] = useState(1);

  const [slotOffset, setSlotOffset] = useState(0);

  const [exposedCards, setExposedCards] = useState([ dorso, dorso, dorso, dorso ]);

  const [playerCards, setPlayerCards] = useState([]);

  const exposedCardsRef = useRef(exposedCards);


  useEffect(() => {

    const clearGame = (event) => {
	    setState("OPEN");
	    setScores([0, 0]);
	    setMultiplier(1);
	    setTrump(dorso);
	    setStep("trump");
	    setDelegate(false);
	    setPlayerCards([]);

	    resetExposedCards();
    };


    const updateFlow = (event) => {
       debugger;
       var specData = event.spectator;
       var slotData = event.slot;
       var turnData = event.turn;
       var stateData = event.state;
       var trumpCard = dorso;
       var _scores = [ 0, 0 ];

       var flowData = event.flow;
       if(flowData != null) {
           if(flowData.trump != null) {
	       if(flowData.trump != "DELEGATE" && flowData.trump != "") trumpCard = { "type": flowData.trump, "value": "1" };
	       setDelegate(flowData.trump == "DELEGATE");
           }
           setTrump(trumpCard);

           if(flowData.step != null && flowData.step != "") {
	       setStep(flowData.step);
           }
           if(flowData.multiplier != null && flowData.multiplier != "") {
	       setMultiplier(parseInt(flowData.multiplier));
           } else {
	       setMultiplier(1);
           }

           if(flowData.score_team1 != null || flowData.score_team2 != null) {
	       if(flowData.score_team1 != null) _scores[0] = parseInt(flowData.score_team1);
	       if(flowData.score_team2 != null) _scores[1] = parseInt(flowData.score_team2);
           }
           setScores(_scores);
       }

       if(turnData != null) {
	       setTurn(turnData);
       }
       if(slotData != null) {
	       setSlotOffset(parseInt(slotData));
       }
       if(stateData != null) {
	       setState(stateData);
       }
       if(specData != null) {
	       setSpectator(specData);
       }

    };

    const updatePlayerCards = (event) => {
      debugger;
      //var slot = event.slot;
      //console.log("slotoffset=", slot);
      var cards = event.cards;
      //if(slot != null) setSlotOffset(slot);
      if(cards) setPlayerCards(cards);
    };


    const updateExposedCard = (event) => {
      debugger;
      var slot = event.slot;
      var pos = event.pos;
      var card = event.card;
      if(card == null) card = dorso;
 
      if(slot != null) setSlotOffset(slot);
      console.log("Getting slotoffset=", slotOffset);
      console.log("pos=", pos, ",card=", card);
      setExposedCard(pos, card);
    };

    exposedCardsRef.current = exposedCards;
    window.addEventListener('clear-game', clearGame);
    window.addEventListener('update-player-cards', updatePlayerCards);
    window.addEventListener('update-exposed-card', updateExposedCard);
    window.addEventListener('update-flow', updateFlow);

    return () => {
      window.removeEventListener('clear-game', clearGame);
      window.removeEventListener('update-player-cards', updatePlayerCards);
      window.removeEventListener('update-exposed-card', updateExposedCard);
      window.removeEventListener('update-flow', updateFlow);
    };
  }, [slotOffset, playerCards, exposedCards, state, scores, trump, delegate, multiplier]);


  const resetExposedCards = () => {
      let _exposedCards = exposedCardsRef.current.slice(0);
      for(var i=0; i < 4; i++) _exposedCards[i] = dorso;
      exposedCardsRef.current = _exposedCards;
      setExposedCards(_exposedCards);
  };



  const setExposedCard = (pos, card) => {
          console.log("setExposedCard:pos=", pos);
          let _exposedCards = exposedCardsRef.current.slice(0);  // clone to modify ref (else ReactJS DOM not updated)
          _exposedCards[pos] = card;

          exposedCardsRef.current = _exposedCards;

          setExposedCards(_exposedCards);

          /*
	  setExposedCards((prev) => {
		  prev[pos] = card;
		  return prev;
	  });
          */
  };

  const onTrumpSelection = (event) => {
      const t = event.target.dataset.type;
      console.log("Card trump: " + t, event);
      window.app.view.board.selectTrump(t);
  };

  const onDoubleResponse = (event) => {
      const t = event.target.dataset.type;

      console.log("Response: " + t, event, ", prev multiplier=", multiplier);
      if(t == "ACCEPT_DOUBLE") setMultiplier(multiplier*2);

      window.app.view.board.sendDoubleResponse(t, multiplier);
  };



  const onCardRetract = (event) => {
      const v = event.target.dataset.value;
      const t = event.target.dataset.type;
      console.log("Card retracted: " + event.target.dataset.value + " " + event.target.dataset.type, event);
      if(t != "dorso") {
        setPlayerCards( [...playerCards, { "type": t, "value": v } ] );
	setExposedCard(slotOffset, dorso);
      }
  };

  const onCardExposed = (event) => {
      console.log("onCardAdd: slotOffset=", slotOffset);

      debugger;
      const v = event.target.dataset.value;
      const t = event.target.dataset.type;
      const indexToRemove = event.target.dataset.index; 

      // clear errors
      $(event.target.parentElement.parentElement).find("button").css({ "border-color": "", "border-width": "", "margin-top": ""});

      // validate 
      var cardName = v + "_" + t;
      if(!window.app.view.board.isValidAction(slotOffset, "EXPOSE", cardName, playerCards)) {
	 $(event.target).css({ "border-color": "red", "border-width": "3px", "margin-top": "-50px"});
	 return;
      }

      // UI optimization: clear cards when round is filled before all round data is received from network.
      let _exposedCards = exposedCardsRef.current.slice(0);
      let roundWasCompleted = true;
      for(var i = 0; i < 4; i++) {
        if(_exposedCards[i].type == "DORSO") {
          roundWasCompleted = false;
          break;
        }
      }

      if(roundWasCompleted) {
          resetExposedCards();
      }

      // Show exposed card
      setExposedCard(slotOffset, {"type": t, "value": v } );

      // Remove exposed card from player's hand
      setPlayerCards( (prev) => { 
	// THIS DOESN'T PRESERVE ORDER OF SELECTED CARD:
        // let indexToRemove = -1; 
      	// prev.some( (item, i) => { 
        //   if(item.value == v && item.type == t) indexToRemove = i; 
        //   return indexToRemove != -1; 
	// });
	console.log("indexToRemove=", indexToRemove);
        return prev.filter((item, i) => i != indexToRemove );
      });

      var cardName = v + "_" + t;
      window.app.view.board.exposeCard(cardName);
  };

  const startGame = (event) => {
	  window.app.lobby.start_game();
  };

  const endGame = (event) => {
	  debugger;
	  window.app.lobby.end_game();
  };


  const toggleUserState = (event) => {
	  window.app.lobby.toggle_client_state();
  };



  return (
    <>
<div id="game_info">
    <h4 style={{float: "left", clear: "both"}}><span id="game_info_title" data-l10n-id="app.game_info.title" data-l10n-args='{"game_type": "Botifarra"}'>Game</span></h4>

    <div id="group_params" style={{float: "left", clear: "both", width: "100%"}}>
      <fieldset>
	  <legend>Game</legend>

          <div style={{float: "right", height: "180px"}} >
	    <table><tbody><tr><th data-l10n-id="app.games.trump">Trump</th></tr></tbody></table>
            <Card type={trump.type} value={trump.value} disabled={true} onCardSelection={onCardExposed} style={{margin: "auto"}} />
          </div>

	  <div style={{float: "left"}}>
          <table style={{marginBottom: "10px"}}>
	    <tbody>
	      <tr><th align="left" data-l10n-id="app.games.status">Status</th></tr>
	      <tr><td><span id="lblGameStatus" data-l10n-id={"app.group.state." + state.toLowerCase()}>{state}</span></td></tr>
            </tbody>
          </table>

          <table style={{marginBottom: "10px"}}>
            <tbody>
	      <tr><th align="left" data-l10n-id="app.games.scores">Scores</th></tr>
	      <tr><td>Team 1:</td><td align="right"><span id="lblScoreTeam1">{scores[0]}</span></td></tr>
	      <tr><td>Team 2:</td><td align="right"><span id="lblScoreTeam2">{scores[1]}</span></td></tr>
	    </tbody>
	  </table>

          <table style={{marginTop: "10px"}}>
	    <tbody>
	      <tr><th align="left" data-l10n-id="app.games.multiplier">Multiplier</th></tr>
	      <tr><td><span id="lblTrumpMultiplier">x{multiplier}</span></td></tr>
	    </tbody>
	  </table>

	  </div>


      </fieldset>
      <fieldset style={{marginBottom: "5px"}}>
        <legend>Players</legend>
        <table id="members">
          <thead>
          </thead>
          <tbody>
          </tbody>
        </table>
      </fieldset>
    </div>

    <div style={{clear: "both"}}>
	  { (state == "OPEN") && (<button id="btnStartGame" data-l10n-id="app.actions.start_game" onClick={startGame}>Start</button>) }
          { (state != "FINISHED") && (<button id="btnFinishGame" data-l10n-id="app.actions.end_game" onClick={endGame}>End</button>) }
	  { (state == "OPEN") && (<button id="toggle_client_state" onClick={toggleUserState}>Ready</button>) }
    </div>
</div>


      <FlowStatus spectator={spectator} state={state} turn={turn} slotOffset={slotOffset} step={step} style={{flexGrow: 1}} />
      { (!spectator && turn == slotOffset && step != null && step == "trump") && (<TrumpCard delegate={delegate} onTrumpSelection={onTrumpSelection} style={{flexGrow: 1}} />) }
      { (!spectator && turn == slotOffset && step != null && step.indexOf("double") != -1) && (<DoubleQuestionBox onDoubleResponse={onDoubleResponse} multiplier={multiplier} style={{flexGrow: 1}}/>)}
      { (spectator || step == "play") && (<ExposedCards onCardSelection={onCardRetract} exposedCards={exposedCards} slotOffset={slotOffset} style={{flexGrow: 1}}/>)}
      { (!spectator) && (<PlayerCards onCardSelection={onCardExposed} cards={playerCards} />) }
    </>
  )
}

export default App
