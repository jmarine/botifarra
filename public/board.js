/*
    WebGL 8x8 board games
    Copyright (C) 2011 by Jordi Mariné Fort

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var game;

var app = app || {};
app.view = app.view || {};
app.view.board = (function() {


function Board()
{
  return this;
}

Board.prototype =
{
  checkGameStatus: function() {
    var isOver = false;
    //validMoves = game.getMovements();
    if(isOver) {
        var winner = game.getWinner();
        if(winner) document.l10n.formatValue("app.messages.player_won", { "player": winner } ).then(function(msg) { app.view.UI.showMessage(msg) }); 
        else document.l10n.formatValue("app.messages.no_winner", { "player": winner } ).then(function(msg) { app.view.UI.showMessage(msg) });
        $("#btnResignGame").hide();
        $("#btnDrawGame").hide();
        $('#btnRetractMove').each(function() {
          this.disabled = true;
        });
    }
  },

  setBackgroundColor: function(r,g,b) {
	  console.log("color: ", r, g, b);
	  $("#root").css("background-color", "rgb(" + r*255.0 + "," + g*255.0 + "," + b*255.0 + ")");
  },

  acceptHumanMove: function(ac) {
    waitingHumanMove = false;
    this.checkGameStatus();
    
    if(ac) {
        waitingHumanMove = true;
        moveGen = null;
        moveGenLast = null;
        moveStartTime = 0;
    }

    this.invalidate();
  },

  selectTrump: function(t, isReplay) {

    this.acceptHumanMove(false); 

    if(!isReplay) {
        app.lobby.sendSelectTrump(game, t);

        console.log("selectTrump: sendActionToGame");
    }

    //playSound('move');
    //app.view.UI.setTurn(game.toggleTurn());
    app.view.UI.showMessage(false);

  },

  sendDoubleResponse: function(response, multiplier, isReplay) {

    this.acceptHumanMove(false);

    if(!isReplay) {
        app.lobby.sendDoubleResponse(game, response, multiplier);

        console.log("sendDoubleResponse: " + response);
    }

    //playSound('move');
    //app.view.UI.setTurn(game.toggleTurn());
    app.view.UI.showMessage(false);

  },

  isValidAction: function(actionSlot, actionName, actionValue, privateCards) {
    debugger;
    return game.isValidAction(actionSlot, actionName, actionValue, privateCards);
  },


  exposeCard: function(card, isReplay) {

    this.acceptHumanMove(false); 

    if(!isReplay) {
        app.lobby.sendExposeRequest(game, card);

        console.log("exposeCardOnGame: sentCardToGame");
    }

    //playSound('move');
    app.view.UI.setTurn(game.toggleTurn());
    app.view.UI.showMessage(false);

  },



  init: function() {
    window.onresize = function(e)      {
    }
  },


    load : function(gl)
    {
        console.log("board.load");
        this.resize(null,null,null);
    },



    keyDown : function(gl, keyCode, keyString) {

        if (this.ui.keysDown[ALT_KEYCODE] && keyString == "R") {  // ALT+R: reset camera
            this.invalidate();
        }

        return false;
    },


    handlePressedKeys : function() {
        var currentlyPressedKeys = this.ui.keysDown;

    },



    initGesture : function() {
    },


    endGesture : function() {
        this.dragging = false;
	this.initialScaleFactor = null;
	this.initialRotationOffset = null;
    },



    handleMove : function(x,y,button) {

    },


    invalidate : function() 
    {
	redraw = true;
    },

    update : function(gl, dt)
    {
        this.handlePressedKeys();

        return true;
    },


    resize : function(gl, width, height) 
    {
        this.invalidate();
        return true;
    }
};

board = new Board();
return board;

})();

