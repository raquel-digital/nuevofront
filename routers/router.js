const express = require('express');
const router = express.Router();
var path = require('path');
const requer = require("../config/config");
//const middleware = require("../utils/middleware");
//const buscador = require("../utils/buscador");
const controller = require("../api/arts/controller")


router.get("/admin", (req, res, next) => {
    if(middleware.validAdmin(log)){
      log = undefined;      
      res.sendFile(path.resolve("./public/index-admin.html"))
    }else{
      res.redirect("/login-admin");
    }
})

router.get("/admin/pedidos", (req, res) => {
  // if(middleware.validAdmin(log)){
  //   log = undefined;      
  //   res.sendFile(path.resolve("./public/index-admin-pedidos.html"))
  // }else{
  //   res.redirect("/login-admin");
  // }
  //res.sendFile(path.resolve("./public/index-admin-pedidos.html"))
  res.send("ok")
})
router.get("/admin/pedidos/local", (req, res) => {
  // if(middleware.validAdmin(log)){
  //   log = undefined;      
  //   res.sendFile(path.resolve("./public/index-admin-pedidos.html"))
  // }else{
  //   res.redirect("/login-admin");
  // }
  res.sendFile(path.resolve("./public/index-adminPedidos-local.html"))
})

let log;

router.get("/login-admin", (req,res) => {
  res.sendFile(path.resolve("./public/login-admin.html"))
})

//-----CATEGS-----------
 router.get("/categoria/", (req, res) => {    
    const categOrganicer =  require("../utils/cargarCategoria");
    const categIO = req.query.categ
    const categ = req.query.categ.toLowerCase()
    const tag = req.query.tag;    
    let io = require('../io.js').get();  
    io.once('connect', socket => {    
      (async () => {
          socket.emit("loading")
          let result = await categOrganicer(categ);
          result.categ = categIO
          socket.emit("categ-result", result);
          if(tag){            
            socket.emit("tag-result", tag);            
          }
      })();
    })   
    res.sendFile(path.resolve("./public/categ.html"))
    //res.redirect("/")
})
//-----BUSCADOR-----
router.get("/buscador", (req, res) => {
  let io = require('../io.js').get();  
  io.once('connect', socket => {
    (async () => {      
        const buscar = req.query.buscar.toLocaleLowerCase();
        
        if(req.query.buscar == " "){
          console.log("ok")
          socket.emit("resultado-vacio");
          return
        }
        const result = await controller.buscarArticulo(buscar); 
        const data = { result: result, query: buscar}       
        socket.emit("resultado-busqueda", data);
    })();
  })   
  res.sendFile(path.resolve("./public/categ.html"));  
})

//----POST--------------

router.post("/valid-log", (req,res) => { 
  log = req.body;
  console.log("valid",log) 
  const check = middleware.validAdmin(log);
  if(check){
    res.redirect("/admin");
  }else{
    res.redirect("/login-admin");
  }
})


const mercadopago =  require("mercadopago")
mercadopago.configure({
    access_token: requer.capDb
});

router.post("/mercadopago", (req, res) => {
    console.log(req.body)
    let preference = {
      items: [
        {
          title:req.body.titulo,
          unit_price: parseInt(req.body.precio),
          quantity: 1,
        }
      ],
      // ...
  "back_urls": {
    "success": "raqueldigital.herokuapp.com/success",
    "failure": "raqueldigital.herokuapp.com/failure",
    "pending": "raqueldigital.herokuapp.com/pending"
    },
      "auto_return": "approved",
// ...
    };
    mercadopago.preferences.create(preference)
    .then(function(response){
      console.log(response)
      res.redirect(response.body.init_point);
    }).catch(function(error){
      console.log(error);
    });
});


//--check out
router.get("/check-out", (req,res) => {
  res.sendFile(path.resolve("./public/check-out.html"))
})


module.exports = router ;