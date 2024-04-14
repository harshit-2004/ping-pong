import { io } from 'socket.io-client'

export default class GameEngine{
    constructor(userName){
        this.userName = userName;
        this.socket = io("http://localhost:8080");

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