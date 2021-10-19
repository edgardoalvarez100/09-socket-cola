
const searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has("escritorio")){
    window.location = "index.html";
     throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");


// Referencias HtmL
const btnAtender = document.querySelector("button");
const lblEscritorio = document.querySelector("h1");
const lblAtendiendo = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");


lblEscritorio.innerHTML = escritorio;
divAlerta.style.display = "none";

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnAtender.disabled = true;
   
});


socket.on('tickets-pendiente',(pendientes) => {
    if(pendientes === 0){
        divAlerta.style.display = ""
        lblPendientes.style.display = "none";
    }else{
        divAlerta.style.display = "none";
        lblPendientes.style.display = "";
        lblPendientes.innerText = pendientes
    }
});

// socket.on('enviar-mensaje', (payload) => {
//     console.log( payload )
// })


btnAtender.addEventListener( 'click', () => {

    socket.emit( 'atender-ticket', {escritorio}, ( {ok, ticket, msg} ) => {
        if(!ok){
            lblAtendiendo.innerHTML = "Nadie";
            console.log(msg)
            return divAlerta.style.display = '';
        }else{
            lblAtendiendo.innerHTML = 'Ticket ' + ticket.numero;
        }
    });

});