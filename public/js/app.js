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

        ingresarCarrito(art)
    }

    //abrir y cerrar descripcion de artículo    
    if(mouse.classList.contains("chevron")){
        if(mouse.classList.contains("chevron-up")){        
            mouse.classList.remove("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "none"
        }else{
            mouse.classList.add("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "block"
        }
    }    

    if(mouse.textContent == "Ver descripción"){
        if( !mouse.nextElementSibling.classList.contains("chevron-up")){
            mouse.nextElementSibling.classList.add("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "block"
        }else{
            mouse.nextElementSibling.classList.remove("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "none"
        }        
    }
})

//Filtros Tags
const filtros = document.querySelector(".filtros")
if(filtros){
    filtros.addEventListener('click', event=>{
        const mouse = event.target
        
        if(mouse.classList.contains("hashtag")){   
          
            mostrador.innerHTML = "";
          
            let articulosTags = []
            const clik = mouse.textContent;
            const clikTag = mouse.textContent.replaceAll(" ", "-");      
            
            for(let p of mostradorDeArticulos){ 
              p.tags = p.tags.replaceAll(" ", "-");
                                
                let codigo = p.tags;         
              
                if(codigo.includes(clikTag)){
                  articulosTags.push(p);
                }
          }
           
            loadTag(articulosTags, clik);
          }
    })
}


//Cargar TAGS de artículos
function loadTag(articulosTags, target){ 
    
    const tags = document.querySelectorAll(".hashtag")
    tags.forEach(e => {        
        if(e.classList.contains("tag-seleccionado")){
            e.classList.remove("tag-seleccionado")
        }
        if(e.textContent == target){
            e.classList.add("tag-seleccionado")
        }
    })
    
    if(articulosTags.length > indice){        
        crearPaginador(articulosTags);
        asignadorPaginador(1);
    }else{        
        showArts(articulosTags);
    }
  
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



