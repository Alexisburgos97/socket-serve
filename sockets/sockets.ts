import socketIO, {Socket} from 'socket.io';
import {UsuariosLista} from "../classes/usuarios-lista";
import {Usuario} from "../classes/usuario";

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket ) => {

    const usuario = new Usuario( cliente.id );

    usuariosConectados.agregar(usuario);
}


export const desconectar = ( cliente: Socket ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario(cliente.id);
    });

}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', ( payload: {de: string, cuerpo: string} ) => {

        io.emit('mensaje-nuevo', payload);

    });

}

//Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', ( payload: {nombre: string}, callack: Function ) => {

        console.log('configurar-usuario', payload);
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        callack({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });

    });

}
