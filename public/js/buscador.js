// const formulario = document.querySelector("#buscador");
// const boton = document.querySelector("#boton");
// var resultado = document.querySelector("#mostrador");

// const buscador = ()=>{
  
//   mostrador.innerHTML = "";
//   paginador.innerHTML = "";

//   const string = formulario.value.toLowerCase();
//     if(string == "") return;
// }

// formulario.addEventListener("keydown", function(event) {
//   // Number 13 is the "Enter" key on the keyboard
//   if (event.keyCode === 13) {                
//     buscador();            
//   }
// })
// boton.addEventListener('click', buscador);

socket.on("resultado-busqueda", result => showArts(result))
       
    showArts(result);
    // busqueda = false;
    // const mostrarRes = []
    // for(let r of result){
    //   if(r.mostrar){
    //     mostrarRes.push(r);
    //   }
    // }
      
    //   if(mostrarRes.length > 0) {
    //     if(mostrarRes.length > indice){        
    //       mostradorDeArticulos = mostrarRes;
    //       paginador.innerHTML = "";        
          //crearPaginador(mostradorDeArticulos);
          //asignadorPaginador(1, mostradorDeArticulos);
    //     }else{
    //       showArts(mostrarRes);
    //     }
    //   }
  
  })
