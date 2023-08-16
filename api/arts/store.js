const { async } = require("rxjs");
const { base } = require("./model");
const model = require("./model");
const { ObjectId } = require("bson") 

const store = {
    leer: async function (){
        try{
            let base = [];
            await model.find().then( a => base.push(a));                 
            return base;
        }catch(err){
            return err;
        }
    },
    ingresar: async function (data){
        try{
            const sys = await new model(data);
            const result = sys.save()
            return { message: "Artículo ingresado", result: true };
        }catch(err){
            return { message: "No se pudo ingresar nuevo artículo " + data.codigo, result: false};
        }
    },
    updateSinCodigo: async function (d){
        d.forEach(data => {
            (async () =>{
                await model.findOneAndUpdate({id: data.id}, {
                    $set: {
                        codigo: data.codigo,
                        imagendetalle: data.imagendetalle,
                        mostrar: data.mostrar,
                        descripcion: data.descripcion,
                        tags: data.tags,
                        categorias: data.categorias,
                        stock: 10
                    }});
                    console.log(data)
            })()
        })
    },    
    update: async function (data){
        try{            
            await model.findOneAndUpdate({codigo: data.codigo}, {                
                $set: {
                    codigo: data.cambioCodigo,
                    mostrar: data.mostrar,
                    tags: data.tags,
                    imagendetalle: data.imagendetalle,
                    descripcion: data.descripcion,
                    categorias: data.categorias,
                    stock: data.stock
                }});
                
            return { status: true};
        }catch(err){
            return { status: false, message: "Error al actualizar " + data.codigo, error: err }; 
        }
       
    },
    updateFromFile: async function (data){
        try{            
            // await model.findOneAndUpdate({codigo: data.codigo}, {                
            //     $set: {
            //         // codigo: data.cambioCodigo,
            //         // mostrar: data.mostrar,
            //         // tags: data.tags,
            //         // imagendetalle: data.imagendetalle,
            //         // descripcion: data.descripcion,
            //         // categorias: data.categorias,
            //         // stock: data.stock
            //     }});

            return { status: true};
        }catch(err){
            return { status: false, message: "Error al actualizar " + data.codigo, error: err }; 
        }
       
    },
    updateColor:async function (data){
        try{
            const res =  await model.updateOne( {codigo: data.codigo, "colores._id" : ObjectId(data._id) } ,
                {
                    $set: {
                        "colores.$.mostrar": data.mostrar
                    }
                }
            )
            console.log("restltado!!!",res)
            return { status: true};
        }catch(err){
            return { status: false, message: "Error al actualizar color " + data.codigo, error: err }; 
        }
    },
    loadCateg: async function (categ){
     try{     
        
        const result = await model.find({categorias: {$in: categ}},
            //elementos que no necesitamos 
            { 
                stock: 0,
                fechaDeIngreso: 0,
                fechaModificacion: 0,
                fechaUltimaVenta: 0,
                imgActualizada: 0 
            }); 
                 
        return result;
        
     }catch(err){
         console.log("[ ERROR EN STORE loadCateg RESULT ] " + err);
     }   
      
    },

    last20: async function (base) {
        //OLD
        //const result = [];
        //base = await model.find().sort({ id: -1}).limit(50);
        // let i = 0;
        // for(b of base){
        //     if(i <= 20 && b.mostrar){
        //         //result.push(b);
        //         //i++;
        //     }
        // }       
        //return result;
        base = await model.find({ mostrar: true }).sort({ id: -1}).limit(30);
        return base;
    },

    lastDateAndId: async function () {
        const find = await (await model.find()).slice(-1);        
        return {id: find[0].id, fechaModificacion: find[0].fechaModificacion}
    },

    delete: async function (art) {
       await model.findOneAndRemove({codigo: art.codigo});       
    },
    deleteSinCodigo: async function (art) {
        await model.findOneAndRemove({id: art});
        console.log("BORRANDO " + art)       
     },
    
    search: async function (query) {
        try{
            //const q = query.toUpperCase();        
            
            const result = await model.find(
                {$or:[ {nombre: { "$regex": query, "$options": "i" }},
                       {nombre2: { "$regex": query, "$options": "i" }}, 
                       {codigo: { "$regex": query, "$options": "i" }}
                ]}
            );
            return result;
        }catch(err){
            console.log("[ ERROR EN SEARCH STORE] " + err)
        }
    },

    updatePrices: async function(data){
        try{          
            await model.findOneAndUpdate({codigo: data.codigo}, {$set: {precio: data.precio}});
        }catch(err){
            console.log(err)
        }
    },
    addColor: async function (code, data) {
        try{            
            await model.findOneAndUpdate({ codigo: code }, { $push: { colores: data }});
            return true;
        }catch(err){
            console.log("[ ERROR EN STORE funcion addColor() ] " + err);
            return false;
        }
    },
 }
 
 module.exports = store;