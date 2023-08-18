//local storage
//const carrito = localStorage.getItem("carrito");

const carrito = []//temporario
//contador de items
const itemsCarrito = document.querySelector("#carritoNumber")
if(carrito.lenght > 0){
    itemsCarrito.value = carrito.length;
}else{
    itemsCarrito.style.display = "none"
}



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


//abrir carrito
document.querySelector(".carrito").addEventListener('click', event=>{
    
    actualizarCarrito()
    
    //mostrar carrito
    const carritoShow = document.querySelector(".drawer-carrito");
    carritoShow.style.display = "block"
})
  
document.querySelector(".drawer-carrito").addEventListener('click', event=>{
  const mouse = event.target
  
  //cerrar carrito
  if(mouse.id == "cerrarCarrito"){
    const cerrar = document.querySelector(".drawer-carrito")
    cerrar.style.display = "none"
  }
  //eliminar artículo individual
  if(mouse.classList.contains("eliminar-articulo")){
        const codigo = event.target.parentElement.childNodes[3].childNodes[1].textContent
        
        for(let i=0; i<carrito.length; i++){
            if(carrito[i].codigo == codigo){
                carrito.splice(i, 1)
                actualizarCarrito()
            }
        }
    }

    if(mouse.id == "eliminar-carrito"){
        carrito.length = 0
        itemsCarrito.value = carrito.length;
        itemsCarrito.style.display = "none"
        actualizarCarrito()
    }
})


const carritoBody = document.querySelector(".carrito-cuerpo");
carritoBody.addEventListener('click', event=>{
    asignarMasMenos(event.target, true)
})

function actualizarCarrito(){
    const carritoBody = document.querySelector(".carrito-cuerpo");
    carritoBody.innerHTML = ""
    
    let sumaTotal = 0

    if(carrito.length == 0){
        document.getElementById("eliminar-carrito").style.display = "none"
        document.getElementById("eliminar-carrito").style.display = "none"

        carritoBody.innerHTML +=  
        `<div class="carrito-emptystate">
            <img src="img/carrito-emptystate.svg" alt="" />
            <p class="empty-titulo">El carrito está vacío</p>
            <p class="empty-texto">Los artículos se agregarán acá luego de apretar “Agregar al carrito” en cada uno de ellos.</p>
            <button type="button" class="btn-primario">Ir a comprar</button>
         </div>`
    }else{
        for(const c of carrito){
        
            const precio = c.precio * c.cantidad_venta
    
            carritoBody.innerHTML += `
                <div class="carrito-item">
                <div class="contenedor-img-carrito" style="background-image: url(${c.imagen});"></div>
                <div>
                    <p style="display: none;">${c.codigo}</p>
                    <p class="item-titulo">${c.nombre}</p>
                    <p class="item-precio">$${Number(precio).toFixed(2)}</p>
                </div>
                <div class="cantidad-card">
                    <button type="button" class="menos"></button>
                    <input class="cantidad-de-venta" type="number" value="${c.cantidad_venta}">
                    <button type="button" class="mas"></button>
                    <a class="eliminar-link">Eliminar</a>
                </div>
                <button type="button" class="eliminar eliminar-articulo"><span class="tooltip-eliminar">Eliminar</span></button>
                </div>
            `
            sumaTotal += precio
        }    
    }
    
    //BUG SI NO HAY ELEAMENTOS CARGADOS NO ABRE EL CARRITO
    const inputCantidadCarrito = document.querySelector(".cantidad-de-venta")
    if(inputCantidadCarrito){
        inputCantidadCarrito.addEventListener("keyup", event => {
            const value = event.target.value
            if(value == "" || value == 0){
                inputCantidadCarrito.value = 1
            }
            const codigo = event.target.parentElement.parentElement.childNodes[3].childNodes[1].textContent
            actualizarPrecioCarrito(codigo, value)
        })
    }    
    document.getElementById("total-carrito-suma").textContent = "$ " + Number(sumaTotal).toFixed(2) 
}

