import { io } from 'socket.io-client'
import Production from '../config.js';

export default class GameEngine{
    constructor(userName){
        this.userName = userName;
        this.socket = io(Production.server_prod);

        if(this.userName){
            this.connectionHandler();
        }
    }
    
    // secondPlayerFinded(){
    //     let data ;
    //     this.socket.on("finded",(e)=>{
    //         data = e;
    //     })
    //     return data;
    // }
    get io(){
        return this.socket;
    }

    connectionHandler(){
        const self = this;

        this.socket.on('connect', function() {
            console.log("Connection established");
        })
        
    }
}