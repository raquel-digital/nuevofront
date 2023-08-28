const express = require('express');
const { send } = require('process');
const app = express();
const http = require('http').Server(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//socket
const io = require('./io.js').init(http);

const requer  = require("./config/config")
const nodemailer = require('nodemailer');

app.use(express.static('./public'));
const router = require("./routers/router");
app.use(router);


const fs = require("fs");
const db = require("./db");//conexion con mongo

db(process.env.mongo);

//const categOrganicer =  require("./utils/cargarCategoria");
const controller = require("./api/arts/controller");
const PORT = process.env.PORT 

//const provincias = require("./utils/provincias.json");
//const categ =  require("./articulos/tipos-categ.json");
const { isUndefined } = require('util');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable.js');

checkOut = false;


io.on('connect', socket => {
    (async () => {
        try{
            const res = await controller.ultimos20subidos()
            socket.emit("productos", res);
        }        
        catch(err){            
            console.log(err + " Error en inciar articulos WEB");  
        }   
        //obtener valores de envío
        socket.on("get-valor-envio", () => {
            const envios = {
                correoReg: Number(process.env.valorCorreoReg), //requer.envioCorreoReg,
                correoNac: Number(process.env.valorCorreoNac), //requer.envioCorreoNac,
                correoNac2:  Number(process.env.valorCorreoNac2),//requer.envioCorreoNac2,
                moto: Number(process.env.valorMoto), //requer.envioMoto,
                expreso: Number(process.env.valorExpreso) //requer.envioExpreso
            }
            socket.emit("set-envio", envios);
        })     
     })();
     
    
    //CHECK OUT
    socket.on("success", () => {
        const provincias = require("./utils/provincias.json");
        socket.emit("provincias", provincias);
    }) 
    socket.on("nuevo-pedido", data => {        
        const pedidoProssesor = require("./utils/procesarPedido");
        const result = pedidoProssesor(data);
        if(result.state){
            const mongoCrud = require("./api/users/controller");            
            mongoCrud.ingresar(data);
        }
        socket.emit("valPeticion", result);
    })
    socket.on("mail", data =>{
        mailEmit(data);        
    })     
});
     



async function mailEmit(data){
    
    const datos = data;
    let compra;
    let sumaTotal = 0;
    
    data.sys.compra.forEach(e => {
        compra +=`
        <tr>
        <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
        <td>${e.codigo}</td>
        <td>${e.titulo}<td>
        <td>${e.cantidad}</td>
        <td>${e.precio}</td>
        </tr>       
        `
        sumaTotal += e.precio * e.cantidad;
    })
    
    const store = require("./api/users/store");
    let orden = await store.numero_orden();
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {            
            user: requer.mail,
            pass: requer.pmail
        },
        tls: {
            rejectUnauthorized: false//importante para que no rebote la conexccion
        }
    })
    let mailOptions;
    if(datos.retira == "Retira en local"){
        
        mailOptions = {
            from: 'SITIO WEB',
            to: 'raqueldigitalweb@gmail.com',
            cc: 'raqueldigitalsitioweb@gmail.com',
            bcc: "oscarcasaraquel@gmail.com",
            subject: 'Pedido Raquel Digital N° orden:' + orden,
            html: ` <h1> NUEVO PEDIDO N° ${orden} </h1>
                    <h3>NOMBRE Y APELLIDO: ${datos.nombreApellido}</h3>
                    <h3>FORMA DE ENVIO: ${datos.retira}</h3>                    
                    <h3>FORMA DE CONTACTO: ${datos.formaDeContacto.contacto} ${datos.formaDeContacto.numero}</h3>
                    <h3>FACTURACION: ${datos.facturacion.tipo} RazonSocial: ${datos.facturacion.RazonSocial} CUIT: ${datos.facturacion.CUIT}</h3>
                    <h3>FORMA DE PAGO: ${datos.formaDePago}</h3>
                    <h1> COMPRA</h1>  
                    <hr>
                    <thead>
               <tr>
                   <th>codigo</th>
                   <th>titulo</th>
                   <th>cantidad</th>
                   <th>precio unitario</th>                   
                   <th>total</th>
               </tr>
              </thead>
              <tbody class="resumen-check-out">
              ${compra}
              </tbody>
              <tfoot >
                <tr class="total-compra-final">
                  TOTAL DEL PEDIDO: ${sumaTotal}
                </tr>
          </tfoot>
            `,
        }     
    }
    if(datos.retira == "Por Envio"){        
            mailOptions = {
                from: 'SITIO WEB',
                to: 'raqueldigitalweb@gmail.com',
                subject: 'Pedido Raquel Digital N° orden:' + orden,
                html: ` <h1> NUEVO PEDIDO N° ${orden} </h1>
                        <h3>NOMBRE Y APELLIDO: ${datos.nombreApellido}</h3>
                        <h3>FORMA DE ENVIO: ${datos.retira}</h3>                   
                        <h3>TIPO DE ENVIO: ${datos.tipoDeEnvio.forma_de_envio}</h3>
                        <h3>FORMA DE PAGO: ${datos.formaDePago}</h3>

                        <h3>DIRECCION DE ENVIO: 
                        <ul>                        
                            <li>
                                PROVINCIA: ${datos.tipoDeEnvio.Provincia}
                            </li>
                            <li>
                                LOCALIDAD: ${datos.tipoDeEnvio.Localidad}
                            </li>
                            <li>
                                TRANSPORTE: ${datos.tipoDeEnvio.Empresa}
                            </li>
                            <li>
                                CALLE: ${datos.tipoDeEnvio.Calle} ALTURA: ${datos.tipoDeEnvio.Altura} PISO: ${datos.tipoDeEnvio.Piso}
                            </li>
                            <li>
                                CP: ${datos.tipoDeEnvio.CP} DNI: ${datos.tipoDeEnvio.DNI}
                            </li>
                            <li>
                                COSTO: ${datos.tipoDeEnvio.Costo}
                            </li>                            
                        </ul></h3>
                        <h3>FORMA DE CONTACTO: ${datos.formaDeContacto.contacto} ${datos.formaDeContacto.numero}</h3>
                        <h3>FACTURACION: ${datos.facturacion.tipo} RazonSocial: ${datos.facturacion.RazonSocial} CUIT: ${datos.facturacion.CUIT}</h3>
                        <h1> COMPRA</h1>  
                        <hr>
                        <thead>
               <tr>
                   <th>codigo</th>
                   <th>titulo</th>
                   <th>cantidad</th>
                   <th>precio unitario</th>                   
               </tr>
              </thead>
              <tbody class="resumen-check-out">
              ${compra}
              </tbody>
              <tfoot >
                <tr class="total-compra-final">
                    TOTAL DEL PEDIDO: ${sumaTotal}
                </tr>
          </tfoot>
                        
                `,
            } 
    }    

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            return err
        }
        console.log("[ MAIL ENVIADO EXITOSAMENTE ]")
    })

}

http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
//en caso de memory leaks por el emmiter
process.on('warning', e => console.warn(e.stack));
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});
