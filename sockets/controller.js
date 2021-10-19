const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('estado-actual',ticketControl.ultimo4);
    socket.emit('tickets-pendiente', ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit('tickets-pendiente', ticketControl.tickets.length);

    //notificar nuevo ticket pendiente de asignar
  });

  socket.on("atender-ticket", ({escritorio}, callback) => {

    if(!escritorio){
      return callback({ok:false, msg: "Escritorio es obligatorio"});
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    if(!ticket){
      return callback({ok:false, msg: "No hay ticket para atender"});
    }

    callback({ok:true, ticket});
    socket.broadcast.emit('estado-actual',ticketControl.ultimo4);
    socket.emit('tickets-pendiente', ticketControl.tickets.length);
    socket.broadcast.emit('tickets-pendiente', ticketControl.tickets.length);

  });



};

module.exports = {
  socketController,
};
