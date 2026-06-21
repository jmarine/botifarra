var app = app || {}
app.view = app.view || {}
app.view.UI = {

playerCardsListeners: [],
exposedCardsListeners: [],

lastMsgId: 0,
nextMsgId: 0,

clearGame: function() {
  let customEvent = new CustomEvent('clear-game');
  debugger;
  window.dispatchEvent(customEvent);
},

notifyPlayerCards: function(slot, cards) {
  let customEvent = new CustomEvent('update-player-cards');
  customEvent.slot = slot;
  customEvent.cards = cards;

  debugger;
  window.dispatchEvent(customEvent);
},


notifyExposedCard: function(slotOffset, pos, card) {
  let customEvent = new CustomEvent('update-exposed-card');
  customEvent.slot = slotOffset;
  customEvent.pos = pos;
  customEvent.card = card;

  debugger;
  window.dispatchEvent(customEvent);
},

notifyFlow: function(state, spectator, slot, turn, flow) {
  let customEvent = new CustomEvent('update-flow');
  customEvent.spectator = spectator;
  if(slot != null) customEvent.slot = slot;
  if(turn != null) customEvent.turn = turn;
  if(flow != null) customEvent.flow = flow;
  if(state != null) customEvent.state = state;

  debugger;
  window.dispatchEvent(customEvent);
},



getGameType: function() {
  return $('select[id=new_grp_type] > option:selected').val();
},

createGame: function() {
	debugger;
     try {
        var gameType = this.getGameType();
        game = app.model.GameFactory.createGame(gameType);
        game.newGame();
	debugger;
	this.clearGame();
        this.setGameState(null);

        window.undoManager.clearUndo();
        app.controller.Storage.showGameStorage();

        var game_type_name = $('select[id=new_grp_type] > option:selected').text();
        document.l10n.setAttributes(document.querySelector('#game_info_title'), "app.game_info.title", { "game_type": game_type_name } );
        document.l10n.formatValue("app.game_info.title", { "game_type": game_type_name } ).then(function(game_info_title) { 
            // Fix FireFox bug:
	    game_info_title = game_info_title.toLowerCase();
            while(game_info_title.length > 0 && game_info_title.charCodeAt(0) == 8296) {
                game_info_title = game_info_title.substring(1);
            }
            game_info_title = game_info_title.substring(0,1).toUpperCase() + game_info_title.substring(1);
            $('#game_info_title').html(game_info_title);
        }); 

        $("#member0_info").html($('select[id=player1] > option:selected').text());
        $("#member1_info").html($('select[id=player2] > option:selected').text());
        $("#member2_info").html($('select[id=player3] > option:selected').text());
        $("#member3_info").html($('select[id=player4] > option:selected').text());
        $("#member0_info").show();
        $("#member1_info").show();
        $("#member2_info").show();
        $("#member3_info").show();
        $("#game_info").show();

        console.log("Game created.");

     } catch(e) {
	debugger;
        alert("Error: " + e.message + "|" + JSON.stringify(e));
     }
},


setGameState: function(group) {
  this.group = group;
  app.view.board.acceptHumanMove(false);
  if(group) this.setTurn(group.turn+1);
  else this.setTurn(0);
  app.view.board.checkGameStatus();
},

updateRetractMoveButton: function() {
  $('#btnRetractMove').each(function() {
	  this.disabled = true;  
  });
},

retractMove: function(event) {
  if(event.data) {
    alert("Not implemented");
    /*
    if(!event.returnValue) {
      // when previous game state is rejected, restore the state to undoManager again
      window.undoManager.add(event.data);
    }
    */

  }
},

setTurn: function(player) {
  $('#lblPlayer1').css('font-weight', 'normal');
  $('#lblPlayer2').css('font-weight', 'normal');
  $('#lblPlayer3').css('font-weight', 'normal');
  $('#lblPlayer4').css('font-weight', 'normal');
  if(player > 0) $('#lblPlayer' + player).css('font-weight', 'bold');
  app.view.board.invalidate();
},

sendChatLine: function() {
  var line = $('#line').val();
  if(line.length > 0) app.lobby.wgsclient.addAction(app.lobby.currentGroup.gid, -1, "CHAT", line);
  $('#line').val('');
},

clearChat: function(action) {
  $("#chat").val('');
},

addChatLine: function(action) {
  $("#chat").val( $("#chat").val() + action.user + "> " + action.value + "\n");
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
  app.view.UI.showGames();
},

getNextMsgId: function() {
  return ++this.nextMsgId;
},

showMessage: function(msg, msgId) {
  if(!msg) enableGoogleAnalytics();

  if(!msgId) msgId = this.getNextMsgId(); 
  if(this.lastMsgId <= msgId) {  // fix async UI messages to user
    this.lastMsgId = msgId;
    if(msg) {
        $('#message').html(msg);
        $('#messageBox').show();
    } else {
        $('#messageBox').hide();
    }
  }
},

showCredits: function() {
  $('#title').show();
  $('#games').hide();
  $('#options').hide();
  $('#tournaments').hide();
  $('#config').fadeIn();
},

showTournaments: function() {
  $('#title').hide();
  $('#games').hide();
  $('#tournaments').show();
  $('#options').hide();
  $('#config').fadeIn();
},

showOptions: function() {
  $('#title').hide();
  $('#games').hide();
  $('#options').show();
  $('#tournaments').hide();
  $('#config').fadeIn();
},

showGames: function() {
  $('#title').hide();
  $('#options').hide();
  $('#games').show();
  $('#tournaments').hide();
  $('#config').fadeIn();
},

hideControls: function() {
  $('#config').hide();
}


}
