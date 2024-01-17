
var originalPath;
var origin;
var browserDetails;
var currentid;
var chathisid;

$(document).ready(function () {
    // Track Host
    origin = window.location.protocol + '//' + window.location.host;
    originalPath = window.location.pathname;
    var referrer = document.referrer;
    console.log("referer" + referrer);
    browserDetails = navigator.userAgent;
    console.log(originalPath);
    //Hide message input till user fill the pre chat form
    $("#message-sent-box").hide();
});
var adminList;
var connectionIds;
$("#startchat").click(function (event) {
    //Update user name 
    var username = $("#username").val();
    
    if (username.length < 3) {
        $("#UserValidate").removeAttr("hidden");
        $("#UserValidate").html("Invalid user");
        event.preventDefault();
        return;
    }
    else {
        $("#UserValidate").hide();
        $("#message-sent-box").show();
        $("#UserName").val(username);
        $("#startchat").hide();
        $("#userInfo").hide();
        var mailId = $("#EmailId").val();
        var userconnectonid = $("#userInput").val();
        console.log(userconnectonid);
        //Get user location and information using IP
        $.getJSON("https://ipapi.co/json/", function (info) {
            var guestIp = info.ip;
            var location = info.city + ', ' + info.region + ', ' + info.country_name;
            var city = info.city;
            var state = info.region;
            var country = info.country_name;
            var countrycode = info.country_code;
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("userip", guestIp);
            sessionStorage.setItem("connectionId", connection.connectionId);
            //function to save user information
            $.ajax({
                url: "/account/saveuser",
                type: "POST",
                data: {
                    "user": username,
                    "email": mailId,
                    "city": city,
                    "state": state,
                    "country": country,
                    "countrycode": countrycode,
                    "Ip": guestIp,
                    "browser": browserDetails,
                    "hostname": origin,
                    "userconnectionid": userconnectonid
                },
                success: function (response) {
                    sessionStorage.setItem("userId", response.userId);
                    var admins = response.admins;
                    //console.log(response.admins);
                    if (admins && admins.length > 0) {
                        connectionIds = admins.map(admin => admin.connectionstring);
                        console.log(connectionIds);
                    } else {
                        console.log("No admins found.");
                    }
                    li = `<li class='receiverli'><div class='receiver_msg'>Welcome to the Chat,Ask for any enquiry</div><span="time-rr"></span></li>`;
                    $("#message-display").append(li);
                    //Notify the admin about new user
                    connection.invoke("NotifyAdmins", connectionIds, response.userId, userconnectonid, username, guestIp, location).catch(function (err) {
                        return console.log(err.toString());
                    });
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
        //console.log(admins);
    }
});

// function to validate user
function uservalidate() {
    var username = $("#username").val();
    if (username.length < 3) {
        $("#UserValidate").removeAttr("hidden");
        $("#UserValidate").html("Invalid user")
    }
    else {
        $("#UserValidate").hide();
    }
}
// function to toggle chat widget
function toggleChat() {
    $("#chat-widget").toggle();
}
$("#chat-icon").click(function(){
    $("#chat-widget").toggle();
});
//Function to fetch active user details
//Those who lost the connection or those didn't end the chat
function showchatbox() {
    $("#chatbox").show();
    $("#list-user-online").show();
    $(".timetracker").show();
    //if("#")
    if ($("#list-user-online div").length > 0) {
        $("#list-user-online div").remove();
    }
    var userid = $("#userId").val();
    $("#chat-box-view").addClass("chat-box-view");
    $(".chatview-main").css("grid-template-columns", "");
    $.ajax({
        url: "https://localhost:7134/account/getactivechat",
        type: "POST",
        success: function (response) {
            console.log(response)
            var len = response.length;
            for (i = 0; i < len; i++) {
                var username = response[i].username;
                var userid = response[i].userid;
                var ip = response[i].ipaddress;
                var location = response[i].location;
                var userconnection = response[i].connectionId;
                //store arrayuserinfo
                Arrayuserinfo[response[i].userid] = response[i];
                var existingUserDiv = document.getElementById(`${userid}`);
                if (!existingUserDiv) {
                    var div = `<div class="list-user-online-active" id="${userid}" data-connection-id="${userconnection}" data-connection-name="${username}">${username}</div>`;
                    var spancount = `<span class="count"></span>`;
                    var span = `<span class="tooltiptext">IP Address:${ip}\nlocation:${location}\nUserId:${userid}</span>`;
                    $("#list-user-online").prepend(div);
                    var divid = `#${userid}`;
                    $(divid).append(spancount);
                    $(divid).append(span);
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    $("#Dashboard-analytics").hide();
    $("#view-history").hide();
}

"use strict";


//Connection URL of signalR
var connection = new signalR.HubConnectionBuilder().withUrl("https://b3a1-115-245-156-254.ngrok-free.app/chatHub").build();
document.getElementById("sendButton").disabled = true;

//On starting connection update connection ID in database
connection.on("UpdateConnected", function (countUser) {
    if (originalPath.includes("dashboard")) {
        console.log("connectionID: " + connection.connectionId)
        var connectionId = connection.connectionId;
        userId = document.getElementById("userId").value;
        $.ajax({
            url: "https://localhost:7134/account/UpdateCon",
            type: "POST",
            data: {
                "userID": userId,
                "connectionID": connectionId
            },
            success: function () {
                sessionStorage.setItem("connectionId", connectionId);
                sessionStorage.setItem("userId", userId);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});
var newchat=[]
connection.on("receiveNotification", function (userid, connectionId, username,guestIp,location) {
    //debugger;
    // console.log(username + "'" + guestIp +"'" + location);
    newchat.push(userid);
    var existingUserDiv = document.getElementById(userid);
    if (!existingUserDiv) {
        console.log("div does not exist");
        var div = `<div class="list-user-online-active" id="${userid}" data-connection-id="${connectionId}" data-connection-name="${username}">${username}</div>`;
        $("#list-user-online").prepend(div);
    }
    else {
        console.log("div exist");
        $(existingUserDiv).find(".count").show();
        $("#list-user-online").prepend($("#" + userid));
        existingUserDiv.setAttribute("data-connection-id", UconnectionId);
        console.log("else");
        spantooltip = `<span class="tooltiptext">IP Address:${guestIP} <br> Place: ${location} <br>}</span>`;
        $(existingUserDiv).append(spantooltip);
        userMessagesCount[userid] = (userMessagesCount[userid] || 0) + 1;
        var countspan = existingUserDiv.querySelector(".count");
        console.log(countspan);
        if (countspan != null) {
            //debugger;
            countspan.textContent = userMessagesCount[userid].toString();
        }
    }
});
//Store number of unread messages of users
var userMessagesCount = {};
//initial value of time tracker
var timetracker = {}; 
function pad(number) {
    return (number < 10 ? "0" : "") + number;
}
//Store data of each user in an array to call whenever needed
var Arrayuserinfo = [];

//Real time update on typing , user typing will be updated here real time
connection.on("UpdateMessage", function (senderid, userid, username, message, UconnectionId) {
    var receiver = document.getElementById("receiverInput").value;
    if (senderid == receiver) {
        var existingli = $("#partialmsg");
        if (existingli.length > 0) {
            existingli.text(`${message}`);
        }
        else {
            var datetime = new Date();
            datetime=dateconvertion(datetime);
            //var hours = datetime.getHours();
            //var min = datetime.getMinutes();
            //var ampm = hours >= 12 ? 'PM' : 'AM';
            //hours = hours % 12;
            //hours = hours ? hours : 12;
            //var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
            var li = `<li id="partialmsg" class="receiverli">${message}<span class="time-ss">${datetime.time}</span></li>`;
            $("#message-display").append(li);
        }
    }
});
//SignalR code to receive message
connection.on("ReceiveMessage", function (senderid, userid, username, message, UconnectionId, isfile) {
    //debugger;
    var receiver = document.getElementById("receiverInput").value;
    var currentUserid = document.getElementById("userInput").value;
    //console.log(message);
    if ($("#partialmsg").length > 0) {
        $("#partialmsg").remove();
    }
    if (receiver == "") {
        console.log("receiver null");
        var existingUserDiv = document.getElementById(`${userid}`);
        if (!existingUserDiv) {
            var div = `<div class="list-user-online-active" id="${userid}" data-connection-id="${UconnectionId}" data-connection-name="${username}">${username}</div>`;
            $("#list-user-online").prepend(div);
            var spantooltip = `<span class="tooltiptext"></span>`;
            $.ajax({
                url: "/account/fetchUserInfo",
                type: "POST",
                data: {
                    "userid": userid
                },
                success: function (userinfo) {
                    console.log(userinfo);
                    Arrayuserinfo[userid] = userinfo;
                    spantooltip = `<span class="tooltiptext">IP Address:${userinfo.ipAddress} <br> Place: ${userinfo.location} <br> Total visit: ${userinfo.totalVisits}</span>`;
                    $("#" + userid).append(spantooltip);
                },
                error: function (error) { console.log(error.toString()); }
            });
            var span = `<span class="count" style="display:initial">${userMessagesCount[userid] || 1}</span>`;
            $("#" + userid).append(span);
            $("#list-user-online").prepend($("#" + userid));
        }
        else {
            $(existingUserDiv).find(".count").show();
            $("#list-user-online").prepend($("#" + userid));
            existingUserDiv.setAttribute("data-connection-id", UconnectionId);
            console.log("else");
            userMessagesCount[userid] = (userMessagesCount[userid] || 0) + 1;
            var countspan = existingUserDiv.querySelector(".count");
            console.log(countspan);
            if (countspan != null) {
                //debugger;
                countspan.textContent = userMessagesCount[userid].toString();
            }
        }
    }
    else {
        if (receiver === senderid) {
            var datetime = new Date();
            var hours = datetime.getHours();
            var min = datetime.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
            console.log("receiver = sender");
            if (isfile != true) {
                li = `<li class='receiverli'><div class='receiver_msg'>${message}</div><span="time-rr">${time}</span></li>`;
            }
            else {

                filetype = message.split(".")[1];
                if (filetype === "png" || filetype === "jpg" || filetype === "jpeg") {
                    li = `<li><img class="uploadimg" src="../tempUpload/${message}"></img></li>`;
                }
                else {
                    li = `<li><a href="../tempUpload/${message}" target="_blank">Open ${filetype} file</a></li>`;
                }
            }
            $("#message-display").append(li);
            var existingUserDiv = document.getElementById(`${userid}`);
            div.textContent = `${username}`;
        }
        else if (currentUserid !== senderid) {
            console.log("receivernot sender");
            //debugger;
            var existingUserDiv = document.getElementById(`${userid}`);
            if (!existingUserDiv) {
                console.log("div does not exist");
                var div = `<div class="list-user-online-active" id="${userid}" data-connection-id="${UconnectionId}" data-connection-name="${username}">${username}</div>`;
                $("#list-user-online").prepend(div);
                var span = `<span class="count">${userMessagesCount[userid] || 1}</span>`;
                $("#" + userid).append(span);
            } else {
                $(existingUserDiv).find(".count").show();
                $("#list-user-online").prepend($("#" + userid));
                existingUserDiv.setAttribute("data-connection-id", UconnectionId);
                userMessagesCount[userid] = (userMessagesCount[userid] || 0) + 1;
                var countspan = existingUserDiv.querySelector(".count");
                console.log(countspan);
                if (countspan != null) {
                    countspan.textContent = userMessagesCount[userid].toString();
                } else {
                    var newSpan = document.createElement("span");
                    newSpan.className = "count";
                    newSpan.textContent = userMessagesCount[userid];
                    $(existingUserDiv).append(newSpan);
                }
            }
        }
    }
});

//code to send update on entering keys in keyboard
$("#message-input").keyup(function (e) {
    var senderid = document.getElementById("userInput").value;
    var username = document.getElementById("UserName").value;
    var receiverConnection = document.getElementById("receiverInput").value;
    var message = document.getElementById("message-input").value;
    //get userid if in admin panel
    var user = document.getElementById("userId").value;
    //get userid if in widget
    if (user === "") {
        user = sessionStorage.getItem("userId");
    }
    connection.invoke("UpdatePartialMsg", receiverConnection, senderid, user, username, message).catch(function (err) {
        return console.log(err.toString());
    });
});
//close chat sidebar on clicking close icon
$(".close-sidebar").click(function () {
    $("#chat-setting-sidebar").hide();
    $(".chat-sidebar").addClass("chat-box-view");
    $(".chat-sidebar").removeClass("chat-sidebar");
    $(".chatview-main").css("grid-template-columns", "");
});
var intervalId;
// select user to chat 

$('#list-user-online').click(function (event) {
    var clickedElement = event.target;
    if (!$(clickedElement).hasClass('tooltiptext')) {
        if (!$(clickedElement).hasClass('list-user-history') && !$(clickedElement).parent().hasClass('list-user-history')) {
            var userID = clickedElement.id;
            if (userID != currentid) {
                if (newchat.includes(userID)) {
                    console.log("contains");
                    $("#join-chat").show();
                }
                else {
                    $("#join-chat").hide();
                }
                currentid = userID;
                if ($("#message-display li").length > 0) {
                    $("#message-display li").remove();
                }
                $(".message-box").show();
                $(".timetracker").show();
                $("#" + userID + " .count").hide();
                $(".chatview-box").show();
                receiverCID = clickedElement.getAttribute("data-connection-id");
                document.getElementById("receiverInput").value = receiverCID;
                var agentName = document.getElementById("user-admin").textContent;
                //sessionStorage.setItem("username") = document.getElementById("user-admin").textContent;
                document.getElementById("UserName").value = agentName;
                // var userID = clickedElement.id;
                document.getElementById("Display-Name").textContent = clickedElement.getAttribute("data-connection-name");
                document.getElementById("ReceiverId").value = userID;
                console.log(receiverCID);
                receiverID = document.getElementById("userId").value;
                connection.invoke("IsConnected", receiverCID).then(function (result) {
                    if (result) {
                        //debugger;
                        console.log("Client is connected");
                    } else {
                        //debugger;
                        console.log("Client is not connected");
                    }
                }).catch(function (err) {
                    console.error(err.toString());
                });
                userMessagesCount[userID] = 0;
                var countspan = $(clickedElement).find('.count');
                if (countspan != null) {
                    countspan.text('');
                }
                $(".chatview-box").removeAttr('hidden');
                if (intervalId) {
                    clearInterval(intervalId);
                }
                var startTime = Arrayuserinfo[userID].startTime;
                var strtime = new Date(startTime);
                
                intervalId = setInterval(function () {
                    var currentTime = new Date();
                    var elapsedTime = currentTime - strtime;
                    // Convert milliseconds to hours, minutes, and seconds
                    var hours = Math.floor(elapsedTime / 3600000);
                    var minutes = Math.floor((elapsedTime % 3600000) / 60000);
                    var seconds = Math.floor((elapsedTime % 60000) / 1000);

                    // Display the elapsed time
                    var formattedTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
                    $(".timetracker").text("Chat Duration : " + formattedTime);
                }, 1000);
                $.ajax({
                    url: "https://localhost:7134/account/fetchMessage",
                    type: "POST",
                    data: {
                        "userId": userID,
                        "receiverId": userId
                    },
                    success: function (messagelist) {
                        var len = messagelist.length;
                        for (i = 0; i < len; i++) {
                            message = messagelist[i].message;
                            var datetime = messagelist[i].lastupdate;
                            var sender = messagelist[i].userID;
                            var isFile = messagelist[i].isfile;
                            var dateobject = new Date(datetime);
                            var datetime = dateconvertion(dateobject)
                            if (isFile === true) {
                                var filetype = message.split(".")[1];
                                if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {
                                    li = `<li><img class="uploadimg" src="../tempUpload/${message}"></img></li>`
                                }
                                else {
                                    li = `<li><a href="../tempUpload/${message}" target="_blank">Open ${filetype} file</a></li>`;
                                }
                                $("#message-display").append(li);
                            }
                            else {
                                if (sender != userId) {
                                    var li = `<li class="receiverli"><div class="receiver_msg">${message}</div><span class="time-sr">${datetime.timestr}</span></li>`;
                                    $("#message-display").append(li);
                                }
                                else {
                                    var li = `<li class="senderli"><div class="sender_msg">${message}</div><span class="time-rr">${datetime.timestr}</span></li>`;
                                    $("#message-display").append(li);
                                }
                            }
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }

                });
                $(".chat-setting-sidebar").hide();
                $(".chat-sidebar").addClass("chat-box-view");
                $(".chat-sidebar").removeClass("chat-sidebar");
                $(".chatview-main").css("grid-template-columns", "");
                $("#nameinfo").text("Name : " + Arrayuserinfo[userID].username);
                var email = Arrayuserinfo[userID].email;
                if (email != "") {
                    $("#mailinfo").text("Email : " + Arrayuserinfo[userID].email);
                } else { $("#mailinfo").text(''); }
                $("#city").text("City : " + Arrayuserinfo[userID].city);
                $("#state").text("State : " + Arrayuserinfo[userID].state);
                $("#country").text("country : " + Arrayuserinfo[userID].country);
                $("#ipaddress").text("IP Address : " + Arrayuserinfo[userID].ipaddress);
                $("#firstseen").text("First seen : " + Arrayuserinfo[userID].firstseen);
                $("#lastseen").text("Last seen : " + Arrayuserinfo[userID].lastseen);
                $("#Totalvisit").text("Total visit : " + Arrayuserinfo[userID].totalvisit);
                var Browserdetails = Arrayuserinfo[userID].browserDetails;
                var browserMatch = Browserdetails.match(/(Chrome|Firefox|Safari|Edge|MSIE|Trident|Opera)\//);
                var oscheck = Browserdetails.match(/\(([^;]+);/);
                var os = oscheck ? oscheck[1] : "OS Unknown";
                var Browser = browserMatch ? browserMatch[1] : "unknown browser";
                $("#OS").text("OS : " + os);
                $("#browser").text("Browser : " + Browser);
            }
        }
        else {
            console.log("History");
            
            clickedId = $(clickedElement).parent().attr('id');
            var username = $(clickedElement).parent().attr('data-connection-name');
            var userid = $(clickedElement).parent().attr("data-connection-id");
            document.getElementById("Display-Name").textContent = username;
            chatid = clickedId;
            $.ajax({
                url: "https://localhost:7134/account/displayhistory",
                type: "POST",
                data: {
                    "chatid": chatid
                },
                success: function (messagelist) {
                    console.log(messagelist);
                    var len = messagelist.length;
                    for (i = 0; i < len; i++) {
                        message = messagelist[i].message;
                        var datetime = messagelist[i].lastupdate;
                        var sender = messagelist[i].userID;
                        var isFile = messagelist[i].isfile;
                        var dateobject = new Date(datetime);
                        dateobject = dateconvertion(dateobject);
                        //var hours = dateobject.getHours();
                        //var min = dateobject.getMinutes();
                        //var ampm = hours >= 12 ? 'PM' : 'AM';
                        //hours = hours % 12;
                        //hours = hours ? hours : 12;
                        //var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
                        if (isFile === true) {
                            var filetype = message.split(".")[1];
                            if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {
                                li = `<li><img class="uploadimg" src="../tempUpload/${message}"></img></li>`
                            }
                            else {
                                li = `<li><a href="../tempUpload/${message}" target="_blank">Open ${filetype} file</a></li>`;
                            }
                            $("#message-display").append(li);
                        }
                        else {
                            if (sender != userId) {
                                var li = `<li class="receiverli"><div class="receiver_msg">${message}</div><span class="time-sr">${dateobject.timestr}</span></li>`;
                                $("#message-display").append(li);
                            }
                            else {
                                var li = `<li class="senderli"><div class="sender_msg">${message}</div><span class="time-rr">${dateobject.timestr}</span></li>`;
                                $("#message-display").append(li);
                            }
                        }

                    }
                },
                error: function (err) { console.log(err.toString()); }
            });
            if (intervalId) {
                clearInterval(intervalId);
            }
            $(".chat-setting-sidebar").hide();
            $(".chatview-box").show();
            $(".timetracker").hide();
            $(".chatview-box").removeAttr('hidden');
            $(".chat-sidebar").addClass("chat-box-view");
            $(".chat-sidebar").removeClass("chat-sidebar");
            $(".chatview-main").css("grid-template-columns", "");
            $("#list-user-online").hide();
            $(".message-box").hide();

        }
    }
});
connection.on("agentjoin", function (agentName, agentId, agentConnectionId) {
    document.getElementById("receiverInput").value = agentConnectionId;
    document.getElementById("ReceiverId").value = agentId;
    console.log(agentName + "has joined the chat");
});
$("#join-chat").click(function () {
    agentName = document.getElementById("user-admin").value;
    agentId = document.getElementById("userId").value;
    agentConnectionId = document.getElementById("userInput").value;
    clientConnectionId = document.getElementById("receiverInput").value;
    ClientId = document.getElementById("ReceiverId").value;
    $("#join-chat").hide();
    newchat = newchat.filter(item => item !== ClientId);
    console.log(newchat);
    connection.invoke("joinchat", clientConnectionId, agentName, agentId, agentConnectionId).catch(function (err) {
        console.log(err.toString());
    })
});

//Save the uploaded file to a url and fetch the url 
function getUrl() {
    var formData = new FormData();
    var fileInput = $("#file-input")[0].files[0];
    formData.append("file", fileInput);
    $.ajax({
        url: "https://localhost:7134/account/fileupload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var li = `<li><a href='../fileuploads/${response.fileurl}'>${response.fileurl}</a></li>`

            var filename = response.fileurl;
            var filetype = filename.split(".")[1];
            if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {
                li = `<li><img class="uploadimg" src="../tempUpload/${filename}"></img></li>`
            } else if (filetype == "pdf") {
                li = `<li><p><a href="../tempUpload/${filename}" target="_blank">Open PDF</a></p></li>`;
            } else {
                li = `<p>File type not supported. <a href="../tempUpload/${filename}" download>Download</a></p>`;
            }
            $(".upload-preview").append(li);
            $("#upload-input").val(filename);
        },
        error: function (error) {
            console.error("Error uploading file", error);
        }
    });
}
//Open chat side bar to show user session details;
$("#Session-details").click(function () {
    $('#profile-tab').tab('show');
    //$("#chat-box-view").removeClass("chat-box-view");
    $(".chatview-main").css("grid-template-columns","60% 40%")
    $("#chat-setting-sidebar").removeAttr("hidden");
    $("#chat-setting-sidebar").show();
});

$(".close-his").click(function () {
    $(".chat-display-list-ul li").remove();
    $(".chat-display-box").hide();
    $(".list-history").show();
});

//End chat session
$("#EndSession").click(function () {
    var userid = document.getElementById("ReceiverId").value;
    var receiverid = document.getElementById("userId").value;
    $.ajax({
        url: "/account/endchat",
        type: "POST",
        data: {
            "userId": userid,
            "receiverId": receiverid
        },
        success: function () {
            var divId = document.getElementById("ReceiverId").value;
            var elementToRemove = document.getElementById(divId);
            if (elementToRemove) {
                elementToRemove.remove();
                // console.log("success");
                $(".chatview-box").hide();
                $(".chat-setting-sidebar").hide();
                $(".chatview-main").css("grid-template-columns", "");
                //$(".chat-sidebar").addClass("chat-box-view");
                //$(".chat-sidebar").removeClass("chat-sidebar");
            }
        },
        error: function (error) {
            console.log(error);
        }
    })
});
//Update connection id as userinput on page load to pass connection id to admin
connection.start().then(function () {
    $("#userInput").val(connection.connectionId);
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
//Function to fetch chat history
$("#history-tab").click(function () {
    var userid = $("#ReceiverId").val();
    var senderid = $("#userId").val();
    if (userid != chathisid) {
        chathisid = userid;
        $("#list-history").show();
        $(".chat-display-box").hide();

        console.log(userid);
        $.ajax({
            url: "/account/fetchhistory",
            type: "POST",
            data: {
                "userid": userid,
                "senderid": senderid
            },
            success: function (response) {
                console.log(response);
                var len = response.length;
                if (len > 0) {
                    for (i = 0; i < len; i++) {
                        var datetimeobj = new Date(response[i].starttime);
                        var hours = datetimeobj.getHours();
                        var min = datetimeobj.getMinutes();
                        var ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12;
                        var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
                        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                        var month = months[datetimeobj.getMonth()];
                        var day = datetimeobj.getDate();
                        var year = datetimeobj.getFullYear();
                        var date = month + '-' + (day < 10 ? '0' + day : day) + '-' + year;
                        var dateTimeString = date + ' ' + time;
                        //console.log("response: " + response[i].chatId + ", " + response[i].starttime);
                        var div = `<div class="chat-history-list" id="${response[i].chatId}">${response[i].useragent}<span style="position: absolute;right: 15px;">${dateTimeString}</span></div>`;
                        $(".dbx-time").text(response[i].useragent);
                        $("#list-history").append(div);
                    }
                }
                else {
                    if ($("#list-history").hasClass("chat-history-list")) {
                        console.log("empty list");
                        if ($(".chat-history-list").length > 0) {
                            $(".chat-history-list").remove();
                        }
                    }
                }
            },
            error: function (error) { console.log(error.toString()) }
        });
    }
   
});

//console.log('.chat-history-list', $(".chat-history-list"))
$("#list-history").click(function (event) {
    if ($(event.target).hasClass('chat-history-list')) {
        //console.log($(event.target).parent().attr("id"));
        var clickedId = $(event.target).attr("id");
        console.log(clickedId)
        $("#list-history").hide();
        $(".chat-display-box").show();
        //if ($(clickedId).hasClass("")) {
        chatid = clickedId;
        $.ajax({
            url: "/account/displayhistory",
            type: "POST",
            data: {
                "chatid": chatid
            },
            success: function (messagelist) {
                var len = messagelist.length;
                for (i = 0; i < len; i++) {
                    message = messagelist[i].message;
                    var datetime = messagelist[i].lastupdate;
                    var sender = messagelist[i].userID;
                    var isFile = messagelist[i].isfile;
                    var dateobject = new Date(datetime);
                    var dateobject = dateconvertion(dateobject)
                    //var hours = dateobject.getHours();
                    //var min = dateobject.getMinutes();
                    //var ampm = hours >= 12 ? 'PM' : 'AM';
                    //hours = hours % 12;
                    //hours = hours ? hours : 12;
                    //var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
                    if (isFile === true) {
                        var filetype = message.split(".")[1];
                        if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {
                            li = `<li><img class="uploadimg" src="../tempUpload/${message}"></img></li>`
                        }
                        else {
                            li = `<li><a href="../tempUpload/${message}" target="_blank">Open ${filetype} file</a></li>`;
                        }
                        $(".chat-display-list-ul").append(li);
                    }
                    else {
                        if (sender != userId) {
                            var li = `<li class="receiverli"><div class="receiver_msg">${message}</div><span class="time-sr">${dateobject.timestr}</span></li>`;
                            $(".chat-display-list-ul").append(li);
                        }
                        else {
                            var li = `<li class="senderli"><div class="sender_msg">${message}</div><span class="time-rr">${dateobject.timestr}</span></li>`;
                            $(".chat-display-list-ul").append(li);
                        }
                    }

                }
            },
            error: function (err) { console.log(err.toString()); }
        });
        // }
    }
});

// Function to send message to signalR hub and store the message in database
$("#sendButton").click(function () {
    var senderid = document.getElementById("userInput").value;
    var username = document.getElementById("UserName").value;
    var receiver = document.getElementById("ReceiverId").value;
    var receiverConnection = document.getElementById("receiverInput").value;
    var message = document.getElementById("message-input").value;
    var user = document.getElementById("userId").value;
    var file = $("#file-input").val();
    if (user === "") {
        user = sessionStorage.getItem("userId");
    }
    var agent = "admin";
    var attachment = "";
    var datetime = new Date();
    var hours = datetime.getHours();
    var min = datetime.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
    // function to save & send message if the message if a text message
    if (message != "") {
        if (receiver != "") {
            $.ajax({
                url: "https://localhost:7134/account/saveMessage",
                type: "post",
                data: {
                    "userId": user,
                    "receiverId": receiver,
                    "message": message,
                    "agentName": agent,
                    "attachment": attachment,
                    "isFile": 'false'
                },
                success: function () {
                    //debugger;
                    var isfile = false;
                    var li = `<li class="senderli"><div class="sender_msg"> ${message} </div><span class="time-rr">${time}</span></li>`;
                    $("#message-display").append(li);
                    $("#message-input").val('');

                    connection.invoke("SendToIndividual", receiverConnection, senderid, user, username, message, isfile).catch(function (err) {
                        return console.log(err.toString());
                    });

                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        else {
            var isfile = false;
            $("#message-input").val('');
            $("#message-input").focus();
            receiverConnectionList = connectionIds;
            console.log(connectionIds);
            var li = `<li class="senderli"><div class="sender_msg"> ${message} </div><span class="time-rr">${time}</span></li>`;
            $("#message-display").append(li);
            connection.invoke("SendToAdmins", receiverConnectionList, senderid, user, username, message, isfile).catch(function (err) { return console.log(err.toString()) });
        }
    }
    // function to save & send message if the message if not a text message
    if (file != "") {
        message = $("#upload-input").val();
        $.ajax({
            url: "https://localhost:7134/account/saveMessage",
            type: "post",
            data: {
                "userId": user,
                "receiverId": receiver,
                "message": message,
                "agentName": agent,
                "attachment": attachment,
                "isFile": 'true'
            },
            success: function () {
                //debugger;
                var isfile = true;
                var filetype = message.split(".")[1];
                if (filetype == "png" || filetype == "jpg" || filetype == "jpeg") {
                    li = `<li class="senderli"><img class="uploadimg" src="../tempUpload/${message}"></img><span class="time-rr">${time}</span></li>`
                }
                else {
                    li = `<li class="senderli"><a href="../tempUpload/${message}" target="_blank">Open ${filetype} file</a><span class="time-rr">${time}</span></li>`;
                }
                $("#message-display").append(li);
                $("#message-input").val('');
                connection.invoke("SendToIndividual", receiverConnection, senderid, user, username, message, isfile).catch(function (err) {
                    return console.log(err.toString());
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
        $("#file-input").val('');
        if ($(".upload-preview li").length > 0) {
            $(".upload-preview li").remove();
        }
    }
});
function showHistory() {
    $("#chatbox").show();
    $("#list-user-online").show();
    $("#Dashboard-analytics").hide();
    $("#chat-setting-sidebar").hide();
    $(".chatview-box").hide();
    $("#chat-box-view").removeClass("chat-sidebar");
    $(".chat-box-view").removeClass("chat-box-view");

    if ($("#list-user-online div").length > 0) {
        $("#list-user-online div").remove();
    }
    $("#chat-box-view").removeClass("chat-box-view");
    $.ajax({
        url :"/account/fetchallchats",
        type: "POST",
        success: function (response) {
            console.log(response);
            var len = response.length;
            for (i = 0; i < len; i++) {
                var existingUserDiv = document.getElementById(`${response[i].chatid}`);
                if (!existingUserDiv) {
                    var time = new Date(response[i].startTime);
                    var timeobject = dateconvertion(time);
                    console.log(timeobject.formattedtime)
                    //var hours = time.getHours();
                    //var min = time.getMinutes();
                    //var ampm = hours >= 12 ? 'PM' : 'AM';
                    //hours = hours % 12;
                    //hours = hours ? hours : 12;
                    //var date = time.getDay();
                    //var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                    //var month = months[time.getMonth()];
                    //var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
                    //var formattedtime = month + "-" + date + " " + time;
                    var div = `<div class="list-user-history" id="${response[i].chatid}" data-connection-name="${response[i].userName}" date>
                    <div class="uName col-3"> ${response[i].userName} </div> 
                    <div class="uEmail col-3 hinfo"> ${response[i].email} </div>
                    <div class="AdminName col-2 hinfo">${response[i].adminName}</div>
                    <div class="col-2 hinfo">${response[i].ipAddress}</div><div class="col-2 hinfo">${timeobject.formattedtime}</div>
                    </div>`;
                    $("#list-user-online").prepend(div);
                }
            }
            
        },
        error: function (err) {
            console.log(err.toString())
        }
    });
}
function dateconvertion(datetime) {
    var time = new Date(datetime);
    var hours = time.getHours();
    var min = time.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var date = time.getDay();
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var month = months[time.getMonth()];
    var time = (hours < 10 ? '0' + hours : hours) + ":" + (min < 10 ? '0' + min : min) + " " + ampm;
    var formattedtime = month + "-" + date + " " + time;
    //console.log("Formattted time " + formattedtime);
    return { formattedtime:formattedtime, timestr:time } 
}
