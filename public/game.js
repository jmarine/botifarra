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


var game = null;

var NONE    = 0;
var PLAYER1 = 1;
var PLAYER2 = 2;
var PLAYER3 = 3;
var PLAYER4 = 4;

var OROS    = 0;
var COPAS   = 1;
var ESPADAS = 2;
var BASTOS  = 3;
var DORSO   = 4;

var PIECE_CHARS  = "OCEBD"; 


var app = app || {} 

app.model = app.model || {}
app.model.GameFactory = {
  createGame: function(gameType) {
    var camelGameType = gameType.substring(0,1).toUpperCase() + gameType.substring(1, gameType.indexOf('-')).toLowerCase();
    var points = gameType.substring(gameType.indexOf('-')+1);
    return eval(" new app.model." + camelGameType + "(" + points + ")");
  }
}

app.model.Game = (function() {
 
function Game() {
  return this;
}

Game.prototype.getTurn = function() {
  return this.turn;
}

Game.prototype.isOver = function() {
  return (this.getMovements().length == 0);
}

Game.prototype.toggleTurn = function() {
  this.turn = (this.turn + 1) % 4;
  return this.turn;
}

Game.prototype.isValidAction = function(actionSlot, actionName, actionValue) {
  return false;
}




// METHODS TO OVERRIDE

Game.prototype.getBoardRotationDegrees = function() {
  return 0;
}


Game.prototype.getPreferedLevelAI = function(alg) {
  if(alg == "MCTS") return 50;
  else return 4;
}

Game.prototype.toString = function() {
  return "[Game]";
}

Game.prototype.clone = function() {
  var copy = new this.constructor();
  copy.turn = this.turn;
  //copy.pieces = this.pieces.slice(0);
  return copy;
}


Game.prototype.initFromStateStr = function(str) {
}

Game.prototype.newGame = function(player1, player2) {
}

Game.prototype.parseMoveString = function(str) {
  return null;
}

Game.prototype.makeStep = function(player, move) {
}

Game.prototype.evaluateState = function(depth) {
  return 0;
}

Game.prototype.isQuiescenceMove = function(move) {
  return true;
}

Game.prototype.getMovements = function() {
  return [];
}

Game.prototype.getWinner = function() {
  return NONE;
}


return Game;
})();
