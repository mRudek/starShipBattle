//************* Importe *************/
//---Zum erstellen des Servers
import { createServer } from "http";
import { Server } from "socket.io";
import express, {  } from 'express';



//************* Programm *************/
//---Server erstellen
const app = express();
const server = createServer(app);
//---Clients erstellen
const io = new Server(server);

// Set static folder
app.use(express.static('public'));

//************* Ankommende Anfragen verarbeiten *************/
// Run when client connects
io.on('connect', socket => {
    //---INIT ON CONNECT
    console.log("first connect: " + socket.id)

    //Sendet Daten weiter an Single oder Multiplayer Manager
    socket.on('case1', dataPack => {
        //dataPack.socket = socket;
        //dataPack.io = io;
        dataPack.switchCase = "TEST";
        switch (dataPack.switchCase) {
            //zurzeit beides Multiplayer MP_ManagerGet7
            case 'TEST':  
                    console.log("Test TEST1 TEST");
                    //Do your Code
                break;       
            default:
                break;
        }
    })
    
    //---handle disconnect
    socket.on('disconnect', () => {
        console.log('A user has disconnected');
      });
});  
//connect finished


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
