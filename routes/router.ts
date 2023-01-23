import { Router, Request, Response } from "express";
import Server from "../classes/server";
import {Socket} from "socket.io";
import {usuariosConectados} from "../sockets/sockets";

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {

    res.json({
        ok: true,
        msj: 'Todo ok!'
    });

});

router.post('/mensajes', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de: de,
        cuerpo: cuerpo
    };

    const server = Server.instance;
    server.io.emit( 'mensaje-nuevo', payload );

    res.json({
        ok: true,
        msj: 'Todo ok!',
        cuerpo: cuerpo,
        de: de
    });

});

router.post('/mensajes/:id', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de: de,
        cuerpo: cuerpo
    };

    const server = Server.instance;
    server.io.in( id ).emit( 'mensaje-privado', payload );

    res.json({
        ok: true,
        msj: 'Todo ok!',
        cuerpo: cuerpo,
        de: de,
        id: id
    });

});

router.get('/usuarios', async (req: Request, res: Response) => {

    const server = Server.instance;

    await server.io.fetchSockets( ).then( (sockets: any[])  => {

        if( sockets.length > 0 ){

            let aux: string[] = [];

            sockets.forEach( (ele: any) => {
               aux.push( ele.id );
            });

            res.json({
                ok: true,
                msj: 'Todo ok!',
                clientes: aux
            });

        }else{
            return res.json({
                ok: false,
                clientes: []
            });
        }

    }).catch( err => {
        return res.json({
            ok: false,
            msj: err,
            clientes: []
        });
    });

});

router.get('/usuarios/detalle', (req: Request, res: Response) => {

    res.json({
        ok: true,
        msj: 'Todo ok!',
        clientes: usuariosConectados.getLista()
    });

});

export default router;
