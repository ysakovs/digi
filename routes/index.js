
/*
 * GET home page.
 */

exports.index = function (io) {

  return function (req, res) {
    
    var rooms = [];
    
    io.sockets.once('connection', function (socket) {
      socket.room = 'Public';
      socket.join(socket.room);

      socket.on('partnerNexted', function(data) {
        socket.broadcast.to(data.room).emit('partnerNexted', data.room);
      });

      socket.on('nextPartner', function(data) {
        rooms = [];
        rooms.push(data);
        socket.broadcast.emit('rooms', rooms);

        socket.leave(socket.room);
        socket.room = data.room;
        socket.join(socket.room);
      });

      socket.on('foundPartner', function(data) {
        rooms.push(data);

        socket.leave(socket.room);
        socket.room = data.room;
        socket.join(socket.room);

        rooms = [];

        socket.broadcast.emit('foundPartnerGlobal', rooms);
        socket.broadcast.to(socket.room).emit('foundPartner', { rooms: rooms, room:data.room });
      });

      socket.on('message', function (message) {
        socket.broadcast.to(socket.room).emit('message', message);
      });

      socket.on('sendTextMessage', function (data) {
        socket.broadcast.to(socket.room).emit('receiveMessage', { room: data.room, message: data.message });
      });

      socket.on('addUser', function () {
        socket.broadcast.to(socket.room).emit('partnerJoined');
      });

      socket.on('disconnect', function() {
        socket.broadcast.to(socket.room).emit('partnerDisconnected');
      });

    });

    res.render('index', {
      title: 'Chatroom + Random Chat'
    });
  }

};