import express from 'express';
import {SERVER_PORT} from "../global/environment";
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer, {
            cors: {
                origin: true,
                credentials: true
            },
        });
        // this.io = require("socket.io")(this.httpServer, {
        //     cors: {
        //         origin: true,
        //         credentials: true
        //     },
        // });

        this.escucharSockets();
    }

    public static get instance(){
        return this._instance || ( this._instance = new Server() );
    }

    private escucharSockets(){

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            //Conectar Cliente
            socket.conectarCliente(cliente, this.io);

            //Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            //Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            //Mensajes
            socket.mensaje(cliente, this.io);

            //Desconectar
            // cliente.on('disconnect', () => {
            //     console.log('Cliente desconectado');
            // });
            socket.desconectar(cliente, this.io);

        });

    }

    start( callback: Function ){
        // this.app.listen( this.port, callback );
        this.httpServer.listen(this.port, callback);
    }

}
