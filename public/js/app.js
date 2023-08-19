const socket = io.connect();
const mostrador = document.querySelector(".contenedor-articulos")
let mostradorDeArticulos;

//Clicks en mostrador
mostrador.addEventListener('click', event=>{
    const mouse = event.target
    //agregar al carrito
    if(mouse.classList.contains("articulo-compra")){
        //seleccionar boton con datos
        const clases = event.target.classList//returns arreglo con las clase
        const boton = document.querySelector("." + clases[1]);
        const cantidad_venta = mouse.parentElement.childNodes[8].childNodes[3].childNodes[3].value
                
        const art = {            
            codigo: boton.getAttribute("codigo"),
            precio: boton.getAttribute("precio"),
            nombre: boton.getAttribute("nombre"),
            imagen: boton.getAttribute("imagen"),
            cantidad_venta: Number(cantidad_venta) 
        }
       
        if(art.cantidad_venta < 1){
            alert("La cantidad del artículo debe ser mayor a cero")
        }else{
            if(carrito.length == 0){
                carrito.push(art);                
            }else{
                let check = false
                for(const c of carrito){
                    if(c.codigo === art.codigo){
                        const a = Number(c.cantidad_venta)
                        const b = Number(art.cantidad_venta)
                        c.cantidad_venta = a + b
                        check = true
                    }
                }
                if(!check){
                    carrito.push(art);
                }
            }
        }
        
        itemsCarrito.style.display = "block"
        itemsCarrito.textContent = carrito.length;
        
    }
    
})
//Filtros Tags
document.querySelector(".filtros").addEventListener('click', event=>{
    const mouse = event.target
    
    if(mouse.classList.contains("hashtag")){   
      
        mostrador.innerHTML = "";
      
        let articulosTags = []
        const clikTag = mouse.textContent.replaceAll(" ", "-");      
        
        for(let p of mostradorDeArticulos){ 
          p.tags = p.tags.replaceAll(" ", "-");
                            
            let codigo = p.tags;         
          
            if(codigo.includes(clikTag)){
              articulosTags.push(p);
            }
      }
       
        loadTag(articulosTags);
      }
})

//Cargar TAGS de artículos
function loadTag(articulosTags){    
    
    // if(mostradorDeArticulos.length > indice){
    //   paginador.innerHTML = "";        

      //crearPaginador(mostradorDeArticulos);
      //asignadorPaginador(1, mostradorDeArticulos);
    // }else{
    //   paginador.innerHTML = "";
    // }
    // paginador.innerHTML = "";
    
    showArts(articulosTags);
  
    if(mostrador.innerHTML === ""){
      mostrador.innerHTML += `
          <h1>NO HAY RESULTADOS</h1>
          `
    }
}

//categorias
document.querySelector("#select-categ").addEventListener('click', event=>{
    console.clear()
    let mouse = event.target.tagName;
    if(mouse == "A"){
        console.log(event.target.textContent)
        //window.location = "https://raqueldigital.herokuapp.com/categoria?categ=" + event.target.textContent;
        window.location = "http://localhost:8080/categoria?categ=" + event.target.textContent;
      }else{
        console.log("not")
    }
    
})

function asignarMasMenos(mouse, cart){
    //cantidades + y -
    if(mouse.classList == "mas"){
       const cant = mouse.previousElementSibling.value++
        if(cart){
           const codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent
           actualizarPrecioCarrito(codigo, Number(cant+1))
        }       
    }
    if(mouse.classList == "menos" && mouse.nextElementSibling.value > 1){
        const cant = mouse.nextElementSibling.value-- 
        if(cart){
           const codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent
           actualizarPrecioCarrito(codigo, Number(cant-1))
        }      
    }
}

function actualizarPrecioCarrito(codigo, cant){
    for(const c of carrito){
        if(c.codigo == codigo){            
            c.cantidad_venta = cant        }
    }
    actualizarCarrito()
}



