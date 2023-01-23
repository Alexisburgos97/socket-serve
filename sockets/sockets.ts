import socketIO, {Socket} from 'socket.io';


export const desconectar = ( cliente: Socket ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', ( payload: {de: string, cuerpo: string} ) => {

        io.emit('mensaje-nuevo', payload);

    });

}
