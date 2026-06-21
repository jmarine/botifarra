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

var app = app || {} 


function update_group_callback(id,details,errorURI,payload,payloadKw) {
	debugger;
	console.log("update_group_callback: payload=",payloadKw);
        if(!errorURI) {  
            if(app.lobby.currentGroup != null && payloadKw != null && payloadKw.gid != null && payloadKw.gid == app.lobby.currentGroup.gid) {
		app.lobby.currentGroup = payloadKw;
                var numRequiredMembers = app.lobby.wgsclient.getGroupMembers(payloadKw.gid).length;
                var membersRowCount = $("#group_params table[id='members'] tbody tr");

                for(var index = 0; index < numRequiredMembers; index += 1) {
                    var memberId = index;
                    var member = app.lobby.wgsclient.getGroupMember(payloadKw.gid, memberId);
		    //var currentUser = app.lobby.wgsclient.user;
		    //var currentUserSelected = (member.user == currentUser);
                    var currentUserSelected = (app.lobby.wgsclient.sid == member.sid);
		    if(index >= membersRowCount.size()) {
		        append_group_member(memberId, member, currentUserSelected);
		    }
               	    populate_group_member_fields(app.lobby.currentGroup, memberId, member, currentUserSelected);
                }

		debugger;
		if(!payloadKw.is_join_event /* && payloadKw.action */) {
                  app.lobby.group_changed(payloadKw, app.lobby.currentGroupOptions); 

                  if(payloadKw.state == "STARTED") {
                    for(var index = 0; index < numRequiredMembers; index += 1) {
                        $("#member"+index+" option[selected!='selected']").remove();
                        //$("#role"+index+" option[selected!='selected']").remove();
                    }
		  }
		}

     	        /*
                debugger;
                var turn = payloadKw.turn;
	        if(turn != null) {
                    $("label.lblPlayer").css("font-weight", "normal");
                    $("#lblPlayer" + (1+turn)).css("font-weight", "bold");
	        }
	        */

	    }

        } else {
            alert("Error joining user:" + payloadKw.errorDesc);
        }    
}



function update_member(field, as_previous_client)
{
    var appId = app.lobby.currentApp;
    var gid = app.lobby.currentGroup.gid;
    var option = $("#" + field + " option:selected");
    var selectedValue = option.val();
    var sid = selectedValue;
    var userType = "user";
    var userTypePos = selectedValue.indexOf(":");
    if(userTypePos != -1) {
        sid = selectedValue.substring(1+userTypePos);
        userType = selectedValue.substring(0,userTypePos);
    }
    var user = option.text();
    if(sid != 0) user = "";
    else if(sid == app.lobby.wgsclient.sid) user = "";
    var slot = parseInt(field.substring(6));
    var roles = ["P1S","P2E","P1N","P2W"];
    var role = roles[slot]; // $("#role" + slot + " option:selected").val();
    var team = 1 + (slot % 2);

    debugger;
    app.lobby.wgsclient.updateMember(appId, gid, "JOINED", slot, (sid? parseFloat(sid) : null), userType, user, role, team, update_group_callback);
}


function populate_group_member_fields(group, memberId, member, currentUserSelected) {
    var memberState  = member.state ? member.state : "empty";
    var memberUserId = member.user  ? member.user  : "";
    var memberName   = member.name  ? member.name  : "";
    var memberSid    = member.sid   ? member.sid   : 0;
    var memberType   = member.type  ? member.type  : "user";
    var memberRole   = member.role  ? member.role  : "";

    var users = [];
    var userOptions = "";
    var isOpen = (group.state == "OPEN");
    var isAdmin = (app.lobby.wgsclient.user == app.lobby.currentGroup.admin);
    var currentUserSid = app.lobby.wgsclient.sid;

    if(memberUserId == "" || memberSid == currentUserSid || isAdmin) {
        userOptions += '<option value="">Empty</option>';
        userOptions += '<option value="user:'+currentUserSid+'" ' + ((currentUserSelected && memberType=="user")? "selected" : "") + '>Me</option>';
	if(isOpen) {
          var connections = app.lobby.wgsclient.getGroupConnections(app.lobby.currentGroup.gid);
          for(var connectionSid in connections) {
            if( isAdmin && (connectionSid != currentUserSid) && (memberSid != connectionSid) ) {
		users.push(connections[connectionSid].name);
                userOptions += '<option value="remote:'+connectionSid+'" ' + ((memberSid==connectionSid || (memberSid == 0 && memberName == connections[connectionSid].name))? "selected" : "") + '>'+connections[connectionSid].name+'</option>';
            }
	  }
        }
    }

    if( (memberUserId != "") && (memberSid != currentUserSid) && (users.indexOf(memberName) == -1) ) {
        userOptions += '<option value="remote:'+memberSid+'" selected>' + memberName + '</option>';
    }

        
    $("#member" + memberId+ " option").remove();
    $("#member" + memberId).append(userOptions);
    
    //$("#role" + memberId+ " option").remove();
    //$("#role" + memberId).append(roleOptions);
    
    
    var status = memberState.toLowerCase();
    if(status == "joined" && app.lobby.currentGroup.state == "STARTED") status = "ready";
    if(status != 'empty') status = memberType.toLowerCase() + "_" + status;
    $("#state" + memberId).attr("src", "resources/images/" + status + ".png");
    $("#state" + memberId).attr("title", ((status!='empty')? memberType.toUpperCase():"") + " " + memberState);
}

function append_group_member(memberId, member, currentUserSelected) {
    var memberRole  = member.role  ? member.role  : "";
    var tbody = $("#group_params table[id='members'] tbody");
    var team = 1+(memberId % 2);
    
    var html = '<tr>';
    html += '<td align="left"><label class="lblPlayer" id="lblPlayer' + (1+memberId) + '" data-l10n-id="app.player" data-l10n-args=\'{"player": ' + (1+memberId) +', "team": ' + team +'}\'>User ' + (1+memberId) + ' (T' + team +'):</label></td>';
    html += '<td align="left"><img title="EMPTY" id="state' + memberId + '" src="resources/images/empty.png" border="0" /></td>';
    html += '<td><select id="member' + memberId + '" onchange="javascript:update_member(\'member'+memberId+'\')"></select></td>';
    html += '</tr>';
    
    tbody.append(html);
}






app.lobby = {

wgsclient: null, 
nick: null, 
currentApp: null,
currentGroup: null,
currentGroupOptions: {},
groupSubscriptionId: null,


GameStatusEnum: {
  GAME_UNDEFINED: 0,
  GAME_PROPOSED: 1,
  GAME_CREATED: 2
},


getWgsClient: function(url) {
    if(url) {
      if(!this.wgsclient || (url != this.wgsclient.url)) {
        if(this.wgsclient) {
            try { this.wgsclient.close(); }
            catch(e) { }
        }
        this.wgsclient = new WgsClient(url);
      }
    }
    return this.wgsclient;
},


login: function(appName, url, user, pass, notificationChannel) {

    document.l10n.formatValue('app.network.connecting').then(function(msg) { app.view.UI.showMessage(msg) } );

    this.wgsclient = this.getWgsClient(url);
    var realm = this.wgsclient.getDefaultRealm();
    var details = { "_notification_channel": notificationChannel, "_oauth2_client_name": appName };
    if(user.length > 0) {
            this.wgsclient.login(realm, details, user, pass, authentication);
    } else {
            this.wgsclient.login(realm, details, null, null, authentication);
    }
}, 


isConnected: function() {
  return (app.lobby.wgsclient && app.lobby.wgsclient.getState() != ConnectionState.DISCONNECTED);
},


onConnect: function(msg) {
    console.log("connected");
    $('#connect_section').hide();
    $('#matching_options').hide();
    $('#btnCreateGame').hide();
    $('#reject').hide();
    $('#btnShowMatchingOptions').fadeIn();
    $('#btnDeleteFinishedGames').fadeIn();
    $('#btnDisconnect').fadeIn();


    $('.logon').show();
    $('#start').fadeIn();
    $('select[id=games]').empty();
    app.view.UI.showMessage(false);

    app.lobby.wgsclient.subscribe("wgs.apps_event", app.lobby.update_groups_list, null, {"match": "exact"} );

    if(msg) {
      this.user = msg;
      this.nick = msg.user;
      this.listGames();
      app.tournaments.list();
      app.tournaments.showAccessButton();
    }
},

loadProfile: function(user) {
  var user = $("#profile_filter").val();
  this.wgsclient.getProfile(user, function(id,details,errorURI,result,resultKw) {
      $("#profile_filter > option[value!='']").remove();
      if(resultKw.opponents) {
          resultKw.opponents.forEach(function(item) {
            var option = $('<option>').attr('value',item.user).text(item.name);
            if(item.user == user) option.attr("selected","selected");
            if(item.picture) option.attr("style","height:34px;background-repeat:no-repeat;background-image:url("+item.picture+");padding-left:35px;background-size: auto 30px;background-position:2px 2px;vertical-align: middle");
            $("#profile_filter").append(option);
          });
      }

      $("#profile_apps>tbody>tr").remove();
      $.each(resultKw.apps, function(app, appStats) {
          var factor = 1;
	  if(user == "" && app.indexOf("botifarra") != -1) factor = 2;  // pair game with double achievement (for each opponent)

          var tr = $('<tr>');
          tr.attr('class', "scrollTableRow");
          tr.append('<td data-l10n-id="app.games.' + app + '">' + app + '</td>');
          tr.append('<td>' + appStats.active + '</td>');
          tr.append('<td>' + (appStats.win  / factor) + '</td>');
          tr.append('<td>' + (appStats.draw / factor) + '</td>');
          tr.append('<td>' + (appStats.lose / factor) + '</td>');
          tr.append("<td><a style='text-decoration: none' href=\"javascript:app.lobby.showRanking('" + app + "', " + (appStats.ranking? appStats.ranking+1 : 0) + ")\"><b>" + (appStats.ranking? appStats.ranking : '-') + "</b></a></td>");

          $("#profile_apps>tbody").append(tr);
      });
      $('#profile_section').show();
  });
},

showRanking: function(app, min) {
  this.wgsclient.getRanking(app, min, function(id,details,errorURI,result,resultKw) {
      //$("#ranking_app").text(app);
      $("#ranking_app").attr("data-l10n-id", "app.games." + app);
      $("#ranking_order>tbody>tr").remove();
      if(result) {
          result.forEach(function(item) {
              var tr = $('<tr>');
              tr.attr('class', "scrollTableRow");
              tr.append('<td>' + item.order + '</td>');
              tr.append('<td>' + item.user.name + '</td>');
              tr.append('<td>' + item.rating + '</td>');
              $("#ranking_order>tbody").append(tr);
          });
      }
      $('#ranking_section').show();
  });
},

sendLoadRequest: function(game, state, toPlayerNumber)
{
  // TODO
},

sendSelectTrump: function(game, t)
{
	debugger;
  var group = app.lobby.currentGroup;
  if(group && this.wgsclient.isMemberOfGroup(group.gid)) {  // When player is not an observer
    var slot = game.getTurn() - 1;
    var data = t;
    this.wgsclient.addAction(group.gid, slot, "SET_TRUMP", data);
  }
},

sendDoubleResponse: function(game, response, multiplier)
{
        debugger;
  var group = app.lobby.currentGroup;
  if(group && this.wgsclient.isMemberOfGroup(group.gid)) {  // When player is not an observer
    var slot = game.getTurn() - 1;
    var data = String(multiplier);
    this.wgsclient.addAction(group.gid, slot, response, data);
  }
},

sendExposeRequest: function(game, card)
{
  var group = app.lobby.currentGroup;
  if(group && this.wgsclient.isMemberOfGroup(group.gid)) {  // When player is not an observer
    var slot = game.getTurn() - 1;
    var data = card;
    this.wgsclient.addAction(group.gid, slot, "EXPOSE", data);
  }
},

deleteFinishedGroups: function() {
  this.wgsclient.deleteFinishedGroups();
  $("#groupsTable>tbody>tr[state='FINISHED']").remove();
},


exitGame: function(disconnecting)
{
    app.view.board.acceptHumanMove(false);
    app.view.UI.notifyFlow("", app.lobby.currentGroupOptions.spectator, app.lobby.currentGroupOptions.slot, -1, {});

    $("#chat_section").hide();
    $("#game_info").hide();
    $("#member0_info").hide();
    $("#member1_info").hide();
    $("#member2_info").hide();
    $("#member3_info").hide();
    $("#state0_info").hide();
    $("#state1_info").hide();
    $("#state2_info").hide();
    $("#state3_info").hide();
    //$("#new_grp_type").removeAttr("disabled");
    $("#player1").removeAttr("disabled");
    $("#player2").removeAttr("disabled");
    $("#player3").removeAttr("disabled");
    $("#player4").removeAttr("disabled");

    $("#btnResignGame").hide();
    $("#btnDrawGame").hide();

    $("#matching_options").hide();
    $("#btnCreateGame").hide();
    $("#btnHideMatchingOptions").hide();
    $("#games_section").show();
    $("#btnShowMatchingOptions").show();
    $("#btnDeleteFinishedGames").show();
    $('#btnRetractMove').hide();
    $('#btnRetractMove').each(function() {
     this.disabled = true;
    });


    var client = this.wgsclient;
    if(this.currentGroup && !disconnecting) {
      var gid = this.currentGroup.gid;
      this.wgsclient.exitGroup(gid, function(id,details,errorURI,result,resultKw) {
            app.lobby.currentGroup = null;
            if(app.lobby.groupSubscriptionId != null) {
              app.lobby.wgsclient.unsubscribe(app.lobby.groupSubscriptionId, update_group_callback, null);
              app.lobby.groupSubscriptionId = null;
            }

            if(!disconnecting) {
                //$("#group_params").hide();
                //list_groups();
            }

      } );
    }

    this.currentGroup = null;
    this.networkGameType = null;
    app.view.UI.showMessage(null);
},


view_group: function(appId,gid) {
    var options = new Object();
    options.spectator = true;
    options.slot = 0;
    try {
      app.lobby.open_group(appId, gid, options);
    } catch(e) {
      console.debug(e.stack);
    }
},

reserve_group_slot: function(appId,gid,slot) {
    //var gid = $('#groups option:selected').attr('value');
    var options = new Object();
    options.spectator = false;
    options.slot = slot;
    try {
      app.lobby.open_group(appId, gid, options);
    } catch(e) {
      console.debug(e.stack);
    }
},

new_group: function() {
    app.view.UI.createGame();
    var appId = $("#new_grp_type").val();
    var gid = null;
    var opponent = $("#new_grp_opponent").val();
    var options = new Object();
    options.automatch = (opponent.length == 0);
    options.opponents = [];
    options.opponents[0] = {}; 
    options.opponents[0].user = opponent; 
    options.observable = $("#new_grp_observable").is(":checked");
    options.data = game.toString();
    options.hidden = $("#new_grp_hidden").is(":checked");
    options.password = $("#new_grp_password").val();
    options.role = $("#new_grp_role option:selected").val();
    if(options.role != "") options.slot = (options.role == "Black") ? 1 : 0;
    app.lobby.open_group(appId, gid, options);
    return false;
},

resign: function() {
    var group = app.lobby.currentGroup;
    if(this.wgsclient && group && group.state != "FINISHED" && this.wgsclient.isMemberOfGroup(group.gid)) {  // When player is not an observer
        var slot = this.wgsclient.getSlotOfGroup(group.gid);
        var data = ""; 
        return this.wgsclient.addAction(group.gid, slot, "RESIGN", data);
    } else {
        return null;
    }
},

offerDraw: function() {
  var group = app.lobby.currentGroup;
  if(this.wgsclient && group && group.state != "FINISHED" && this.wgsclient.isMemberOfGroup(group.gid)) {  // When player is not an observer
    var slot = this.wgsclient.getSlotOfGroup(group.gid);
    var data = ""; 
    this.wgsclient.addAction(group.gid, slot, "DRAW_QUESTION", data);
  }
},

show_group_unused: function(group) {
    debugger;
    var tbody = $("#group_params table[id='members'] tbody");
    tbody.find("tr").remove();

    //if(group.app) {
    //    $("#group_params fieldset legend").html("Group members: " + group.app.name);
    //}

    if(group.members) {
        var currentUser = app.lobby.wgsclient.user;
        var currentUserIsOnlineMember = false;
        var currentUserIsOfflineMember = false;
        group.members.forEach(function(member, index) {
            if(!member.connected && member.user==currentUser) {
                currentUserIsOfflineMember = true;
            }
        });
        group.members.forEach(function(member) {
            var memberId = member.slot;
            var memberUser = "";
            var selected = "";
            var currentUserSelected = false;

            if(member.sid==app.lobby.wgsclient.sid) {
                if(currentUserIsOfflineMember && (!member.connected) && member.user==currentUser) {
                    currentUserSelected = true;;
                    currentUserIsOnlineMember = true;
                    currentUserIsOfflineMember = false;
                }
                if(!currentUserIsOfflineMember && !currentUserIsOnlineMember) {
                    currentUserSelected = true;
                    currentUserIsOnlineMember = true;
                }
            } else {
                memberUser = member.user;
            }

	    var isAdmin = (app.lobby.wgsclient.user == app.lobby.currentGroup.admin);
            append_group_member(memberId, member, currentUserSelected);

        });
    }

    //$("#app_list").hide();
    //$("#group_list").hide();
    //$("#new_group_params").hide();
    $("#toggle_client_state").html("Ready");

    if(app.lobby.wgsclient.user == app.lobby.currentGroup.admin) {
        $("#start_group").show();
        $("#toggle_client_state").hide();
        //$("#add_group_member").show();
        //$("#group_options").show();
    }
    else {
        $("#start_group").hide();
        $("#toggle_client_state").show();
        //$("#add_group_member").hide();
        //$("#group_options").hide();
    }
    //$("#group_params").slideDown(500);


},

toggle_client_state: function()
{
    var appId = app.lobby.currentApp;
    var gid = app.lobby.currentGroup.gid;
    var state = "";
 
    if($("#toggle_client_state").html().toUpperCase()=="READY") {
        $("#toggle_client_state").html("Busy");
        state = "READY";
    } else {
        $("#toggle_client_state").html("Ready");
        state = "JOINED";
    }

    app.lobby.wgsclient.updateMember(appId, gid, state, NaN, false, false, false, false, false, update_group_callback);
},

group_opened: function(group) {
    console.log("group opened: " + JSON.stringify(group));
    app.view.UI.clearChat();
    $("#chat_section").show();
    $("#state0_info").show();
    $("#state1_info").show();
    $("#state2_info").show();
    $("#state3_info").show();
    app.view.UI.hideControls();    

    $('#start').hide();
    $('#games_section').hide();
    $("#matching_options").hide();
    $("#matching_options").hide();
    $("#btnCreateGame").hide();
    $("#btnShowMatchingOptions").hide();
    $("#btnHideMatchingOptions").show();
    $("#btnDeleteFinishedGames").hide();
    if(this.wgsclient.isMemberOfGroup(group.gid) && group.state != "FINISHED") {
         $("#btnResignGame").show();
         $("#btnDrawGame").show();
         $("#btnRetractMove").show();
    } else {
         $("#btnResignGame").hide();
         $("#btnDrawGame").hide();
         $("#btnRetractMove").hide();
    }

    //$("select[id=new_grp_type]").val(group.appName);
    //$('#new_grp_type').attr('disabled','disabled');

    app.view.UI.showMessage(false);
    app.view.UI.createGame();


    if(group.data && group.data.length > 0) game.initFromStateStr(group.data);
    else if(group.initialData && group.initialData.length > 0) game.initFromStateStr(group.initialData);

    if(group.turn) game.turn = 1+group.turn;

    if(group.actions && group.actions.length > 0) {
      var sim = game.clone();
      var lastAction = null;
      group.actions.forEach(function(action, index) {
        if(action.type == "CHAT") {
	  app.view.UI.addChatLine(action);
        } else {
          lastAction = action;
        }

      });
      group.action = lastAction;
    }

},



group_changed: function(group, options) {
    debugger;
    var slotOffset = options.slot;
    var turn = group.turn;
    var flow = group.flow;
    if(group || flow || turn != null) {
	if(group.data != null) game.initFromStateStr(group.data);
        app.view.UI.notifyFlow(group.state, options.spectator, slotOffset, turn, flow);
    }

    var cards = group.privateState;
    if(cards) {
        app.view.UI.notifyPlayerCards(slotOffset, cards);
    }

    debugger;
    var currentRound = (group != null && group.flow != null) ? group.flow.currentRound : null;
    if(currentRound != null && currentRound.length > 0) {
        this.currentSlotOffset = slotOffset;
        var currentRoundParts = currentRound.split(',');

	for(var slot = 0; slot < 4; slot++) {
		debugger;
		var card = null;
		var slotCard = currentRoundParts[slot];
		if(slotCard != null && slotCard != "NONE") {
		  var cardParts = slotCard.split('_');
	          card = { "value": cardParts[0], "type": cardParts[1] }
		}

		app.view.UI.notifyExposedCard(this.currentSlotOffset, slot, card);
	}
    }


    var action = group.action;
    if(action) {

      /* Round was already updated completely with group.flow.currentRound
      if(group.gid != null && action.type != null && action.type == "EXPOSE" && action.slot != null) {
	      var gid = group.gid;
	      var slot = action.slot;
	      var member = this.wgsclient.getGroupMember(gid, slot);

	      debugger;
	      var encodedCard = action.value;
	      var parts = encodedCard.split('_');
	      if(parts.length == 2) {
                //app.view.UI.showMessage(false);
	        var card = { "value": parts[0], "type": parts[1] };
	        app.view.UI.notifyExposedCard(this.currentSlotOffset, slot, card);
	      }
	      debugger;
      }

      group.action = null;
      */


      var currentSlot = this.currentSlotOffset;
      if(action.type == "CHAT") {
        app.view.UI.addChatLine(action);
        group.action = null;

      } else if(action.type == "RESIGN") {
          var player = (action.slot+1);
          document.l10n.formatValue('app.network.player_resigned', { "player" : player }).then(function(msg) { app.view.UI.showMessage(msg) } );
          $("#btnRetractMove").hide();
          $("#btnResignGame").hide();
          $("#btnDrawGame").hide();
          app.view.board.acceptHumanMove(false);

      }

    }


    debugger;
    if(group.turn != null) {
	    game.turn = 1+group.turn;
            app.view.UI.setGameState(group);
    }

},

start_game: function() {
    debugger;
    this.wgsclient.addAction(app.lobby.currentGroup.gid, 0, "START", this.wgsclient.user);
},


end_game: function() {
    var newState = "FINISHED";
    this.update_group(newState);
},

update_group: function(newState) {
    var group = app.lobby.currentGroup;

    if(this.wgsclient.user == group.admin /* || this.wgsclient.isMemberOfGroup(group.gid) */ ) {
        if(confirm("Are you sure?")) {

            this.wgsclient.updateGroup(group.appId, group.gid, newState, false, group.data, group.automatch, group.hidden, group.observable, group.dynamic, group.alliances, function(id,details,errorURI,result,resultKw) {
		debugger;
                if(errorURI) document.l10n.formatValue(errorURI).then(function(msg) { alert(msg) });
            });

            group.state = newState;
        }

    }

},


open_group: function(appId, gid, options) {
    $('#profile_section').hide();
    $("#ranking_section").hide();

    debugger;
    app.view.UI.clearGame();
    app.lobby.currentGroupOptions = options;
    app.lobby.wgsclient.openGroup(appId, gid, options, function(id,details,errorURI,result,resultKw) {
       if(!errorURI) {

	  debugger;
	  if(resultKw != null && resultKw.slotJoinedByClient != null) {
		  app.lobby.currentGroupOptions.slot = resultKw.slotJoinedByClient;
	  }

	  debugger;
          if(!app.lobby.currentGroup) {
                app.lobby.currentApp = resultKw.app;
                app.lobby.currentGroup = resultKw;

                app.lobby.group_opened(resultKw);
                app.lobby.wgsclient.subscribe("wgs.group_event." + resultKw.gid, update_group_callback, null, {} ).then(function(id) { app.lobby.groupSubscriptionId = id; } );
          }
	  update_group_callback(id,details,errorURI,result,resultKw);

       } else if(errorURI == "wgs.incorrectpassword") {
            document.l10n.formatValue('app.network.group_password_prompt').then(function(msg) {
              var password = prompt(msg);
              if(password) {
                if(!options) options = {};
                options.password = password;
                app.lobby.open_group(appId, gid, options);
              }
            });
       } else {
	    document.l10n.formatValue(errorURI).then(function(msg) { alert(msg) });
       }
    });
    return false;
},

getGroupDescription: function(group) {
    return group.state + " (" + group.num + "/" + group.max + "): " + group.description;
},

addGroupListItem: function(group) {
   var localPlayerTurn = false;
   var opt = $('<tr>');
   opt.attr("gid", group.gid);
   opt.attr('observable', group.observable);   
   opt.attr('class', "scrollTableRow");
   opt.attr('state', group.state);

   var viewButton = "";
   if(group.observable || group.admin == app.lobby.wgsclient.user) {
       viewButton = "<br><button onclick=\"javascript:app.lobby.view_group('" + group.appId + "','" + group.gid + "'); return false;\">View</button>";
   }
   
   opt.append('<td data-l10n-id="app.games.' + group.appName +'">' + group.appName + '</td>');
   opt.append('<td><span data-l10n-id="app.group.state.'+group.state.toLowerCase()+'">' + group.state + "</span>" + (group.password? "<br><span data-l10n-id='app.group.password'></span>" : "" ) + '</td>');
   opt.append('<td>' + group.num + "/" + group.max + viewButton + "</td>");
   
   
   var memberCol = $('<td>');
   var members = $('<table>');

   var count = 0;
   var members = $('<table>');
   group.members.forEach(function(member,index) {
       var team = 1 + (count % 2); 
       count++;
       var playerLabel = "<span data-l10n-id='app.player' data-l10n-args='{\"player\": " + count + ", \"team\": " + team + "}'></span>"; // + (member.role? " ("+ member.role +")" : "");
       if(group.state != "FINISHED" && index == group.turn) {
          playerLabel = "<b>" + playerLabel + "</b>"; 
          if(group.members[group.turn].user == app.lobby.wgsclient.user) localPlayerTurn = true;
       }

       var row = $("<tr>");
       row.append("<td nowrap='true'>" + playerLabel + ":</td>");
       if(isFinite(member.sid) && (member.user == "" || member.user == app.lobby.wgsclient.user) ) {
           row.append("<td><button onclick=\"javascript:app.lobby.reserve_group_slot('" + group.appId + "','" + group.gid + "'," + member.slot + "); return false;\" data-l10n-id='app.group.play'>Play</button></td>");
       } else {
           row.append("<td>" + member.name + "</td>");       
       }
        
       members.append(row);
   }); 

   memberCol.append(members);
   opt.append(memberCol);


   if(localPlayerTurn) {
     opt.attr("bgcolor", "#EAB13D");  // remark current turn
     $("#groupsTable>tbody").prepend(opt);
   } else {
     $("#groupsTable>tbody").append(opt);
   }

},

update_groups_list: function(id,details,errorURI,payload,payloadKw) {
    debugger;
    if(payloadKw.groups) {
        //$("#groups option").remove();
        $("#groupsTable>tbody>tr").remove();
        

        console.log("**** update_groups_list ****");
        payloadKw.groups.forEach(function(item) {
            /*
            var opt = $('<option>')
            opt.attr('value',item.gid).text(app.lobby.getGroupDescription(item));
            opt.attr('observable', item.observable);
            $("#groups").append(opt);
            */
            app.lobby.addGroupListItem(item);

            if(gid != null && gid == item.gid) {
	      app.lobby.open_group(item.appId, item.gid, {});	
            }

        });

    } else if(payloadKw.cmd == "group_deleted") {
       
        $("#groupsTable>tbody>tr[gid='"+payloadKw.gid+"']").remove();
        
    } else {  // "group_created" || "group_updated" || user_joined || user_exit || user_updated
        
        if(payloadKw.hidden) {
            //$("#groups option[value='"+response.gid+"']").remove();
            $("#groupsTable>tbody>tr[gid='"+payloadKw.gid+"']").remove();
        } else {
            // if($("#groups option[value='"+response.gid+"']").size() <= 0) {  // insert group
            //   $("#groups").append($("<option>").attr("value", response.gid));
            // }
            //$("#groups option[value='"+response.gid+"']").text(app.lobby.getGroupDescription(response));
            //$("#groups option[value='"+response.gid+"']").attr("observable", response.observable);
            
            $("#groupsTable>tbody>tr[gid='"+payloadKw.gid+"']").remove();
            app.lobby.addGroupListItem(payloadKw);
        }


	/*
        if(app.lobby.currentGroup != null) {
	    update_group_callback(id,details,errorURI,payload,payloadKw);
        }
	*/
 
    }
    
},


listGames: function()
{
    var view = $('input[name="rbGameListFilter"]:checked').val();
    $('#start').hide();
    $('#games_section').fadeIn();
    $("#groupsTable>tbody>tr").remove();
    this.wgsclient.listGroups(null, view, null, function(id,details,errorURI,result,resultKw) {
        if(!errorURI) {
            app.lobby.update_groups_list(id,details,errorURI,result,resultKw);
            $("#app_list").hide();
            if(gid == null || gid.length == 0) $("#group_list").slideDown(500);
            else gid = "";  // TODO: show/hide buttons
        } else {
	    document.l10n.formatValue(errorURI).then(function(msg) { app.view.UI.showMessage(msg) } );
        }
    });

},


disconnect: function() {
    console.log("Disconnecting.");
    if(this.wgsclient) {
        app.tournaments.hideAccessButton();
        app.tournaments.unsubscribe();

        this.exitGame(true);
        this.wgsclient.close();
        this.wgsclient = null;

        $('.logon').hide();
        $("#btnProfile").hide();
        $("#user").val("");
        $("#password").removeAttr("disabled");
        $("#password").val("");
        if(provider.length == 0) {
          $("#password").show();
          $("#lbl_password").show();
          $("#user").removeAttr("disabled");
          $("#server_url").removeAttr("disabled");
        }

        $("#btnConnect").removeAttr("disabled");
        $("#btnRegister").removeAttr("disabled");
        $("#oic_connect").removeAttr("disabled");
        $("#btnConnect").show();
        $("#oic_connect").show();
        $("#btnRegister").show();
        //$("#participants").html("");

        $('#start').hide();
        $('#open_game').hide();
        $('#reject').hide();
        $('#btnDisconnect').hide();
        $('#matching_options').hide();
        $('#btnCreateGame').hide();
        $('#btnShowMatchingOptions').hide();
        $('#btnHideMatchingOptions').hide();
        $('#btnDeleteFinishedGames').hide();
        $("#btnResignGame").hide();
        $("#btnDrawGame").hide();
        $('#games_section').hide();
        $('#connect_section').fadeIn();
        $("#profile_section").hide();
        $("#ranking_section").hide();

        $("#groupsTable>tbody>tr").remove();

	//wait sending of unavailable presence stanzas
        document.l10n.formatValue('app.network.disconnected').then(function(msg) { app.view.UI.showMessage(msg) } );
        console.log("Disconnected");
        //enable_network();
    }
    this.wgsclient = null;
}

}
