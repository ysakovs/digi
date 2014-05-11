var socket = io.connect('http://localhost:3000');

$(document).ready(function() {

  var chatMessagesWindow = document.getElementById('chatMessagesWindow');
  var html = '';
  var room = 'Public';
  var rooms = [];

  socket.on('connect', function() {
    socket.emit('addUser');
    html += '<p class="statusMessage">You are currently in the Public chatroom. Click next to match a random partner!</p>';
    chatMessagesWindow.innerHTML = html;
  });

  $('#nextPartnerButton').on('click', function() {
    if (room !== 'Public' & room != null) 
      socket.emit('partnerNexted', room);
    $('#videoCallButton').hide();
    $('#nextPartnerButton').prop('disabled', true);
    html += '<p class="statusMessage">Searching for a new partner...</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();

    if (rooms.length > 0) {

      $.each(rooms, function(index, value) {
            room = value.room;
            socket.emit('foundPartner', { room: room });

            html += '<p class="statusMessage">You matched with a new partner.</p>';
            chatMessagesWindow.innerHTML = html;
            scrollDown();
            $('#nextPartnerButton').prop('disabled', false);
            $('#videoCallButton').show();
            $('#chatInput').focus();
            rooms = [];
            return false;
        });
    } else {
      room = makeId();
      socket.emit('nextPartner', { room: room });
      rooms.push({room: room});
    }
  });

  socket.on('partnerNexted', function (data) {
    html += '<p class="statusMessage">Partner has nexted you. Click next to find a new partner!</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();
    $('#videoCallButton').hide();
  })


  socket.on('foundPartnerGlobal', function(data) {
    rooms = data;
  });

  socket.on('foundPartner', function(data) {
    html += '<p class="statusMessage">You matched with a new partner.</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();
    $('#nextPartnerButton').prop('disabled', false);
    $('#videoCallButton').show();
    $('#chatInput').focus();
    rooms = [];
    room = data.room;
  });

  socket.on('rooms', function(data) {
    rooms = data;
  });

  socket.on('partnerJoined', function() {
    html += '<p class="statusMessage">A partner has joined the room.</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();
  });

  socket.on('partnerDisconnected', function() {
    html += '<p class="statusMessage">A partner has left the room.</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();
    $('#videoCallButton').hide();
  });

  socket.on('receiveMessage', function (data) {
    html += '<p><span id="partnerSaid">Partner: </span> '+ data.message +'</p>';
    chatMessagesWindow.innerHTML = html;
    scrollDown();
  });

  $('#chatInput').keyup(function(e) {
      if (e.which == 13) {
      	var message = $(this).val();

          sendTextMessage(room, message);

          html += '<p><span id="youSaid">You: </span>'+ message +'</p>';
          chatMessagesWindow.innerHTML = html;
          scrollDown();

          $(this).val('');
      }
  });

  function sendTextMessage(room, message) {
    socket.emit('sendTextMessage', { room : room, message: message });
  }

  function scrollDown() {
    chatMessagesWindow.scrollTop = chatMessagesWindow.scrollHeight;
  }

  function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

});