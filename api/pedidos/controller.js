const { model } = require("mongoose");
const { async } = require("rxjs");
const store = require("./store");

const controller = {
    ingresar: async function (data){
       
        const dia = new Date().getDate().toString();
        const mes = new Date().getMonth() + 1;
        const anio = new Date().getFullYear().toString();
        const fecha = dia + "/" + mes.toString()  + "/" + anio;
        
        const order = {    
        fecha: fecha,
        num_orden: data.numero_orden,
        cliente: data.nombreApellido,
        prepara: "Oscar",
        estado: "Pedido Sin Asignar",
        compra: data.compra,
        faltas: [],
        notas: " "
       }
       store.ingresar(order);
   },
   buscar: async function () {
    try{
      const response = await store.find();
      return response;
    }catch(err){
        console.log("[ ERROR EN CONTROLLER BUSCAR ] " + err);
    }
   },
   buscarSinTerminar: async function () {
    try{
      const response = await store.findOld();
      return response;
    }catch(err){
        console.log("[ ERROR EN CONTROLLER BUSCAR ] " + err);
    }
   },
   updatePedidos: async function (pedidos){
    try{
      pedidos.forEach(e => {
        (async () => { 
          await store.update(e);
        })();
      });
      return true;
    }catch{
        console.log(" [ ERROR EN CONTROLLER ] " + err);
        return false;
    }
   },
   borrarPedidos: async function (orden) {
    try{      
      await store.delete(orden);
      return true;
    }catch(err){
      console.log("[ ERROR EN CONTROLLER borrarPedido ] " + err)
    }
   },
   ingresarCarrito: function(data){
    const date = new Date()
    const fecha = date.toLocaleString()
    data.fecha = fecha
    store.writeCarrito(data)
   }
}


module.exports = controller;