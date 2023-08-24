//local storage
let carrito = JSON.parse(localStorage.getItem("carrito"))
if(carrito == null || carrito == undefined){
    carrito = []
}

const itemsCarrito = document.querySelector("#carritoNumber")
if(carrito.lenght > 0){
    itemsCarrito.value = carrito.length;
}else{
    itemsCarrito.style.display = "none"
}

//abrir carrito
document.querySelector(".carrito").addEventListener('click', event=>{
    
    actualizarCarrito()
    
    //mostrar carrito
    const carritoShow = document.querySelector(".drawer-carrito");
    carritoShow.style.display = "block"
})
 
//eventos dentro del carrito
document.querySelector(".drawer-carrito").addEventListener('click', event=>{
  const mouse = event.target
  const carritoShow = document.querySelector(".drawer-carrito");

  //cerrar carrito
  if(mouse.id == "cerrarCarrito"){
    carritoShow.style.display = "none"
  }
  //eliminar artículo individual
  if(mouse.classList.contains("eliminar-articulo")){
        const codigo = event.target.parentElement.childNodes[3].childNodes[1].textContent
        
        for(let i=0; i<carrito.length; i++){
            if(carrito[i].codigo == codigo){
                carrito.splice(i, 1)
                //itemsCarrito.value = carrito.length;                
                actualizarCarrito()
                
                if(carrito.lenght == 0){                    
                    //itemsCarrito.style.display = "none"
                    const footer = document.querySelector(".carrito-footer")
                    footer.style.display = "none"
                }
                
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }
        }
    }

    if(mouse.id == "eliminar-carrito"){
        carrito.length = 0                
        actualizarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
        mostrarToats("Carrito eliminado con éxito.")
    }
    if(mouse.id == "confirmar-compra"){
        window.location = "http://localhost:8080/check-out"
    }

    //TEST cierre haciendo click fuera del carrito
    if (mouse.classList.contains("drawer-carrito")) {
        carritoShow.style.display = "none"
    }    
    console.log(mouse.classList)
})


const carritoBody = document.querySelector(".carrito-cuerpo");
carritoBody.addEventListener('click', event=>{
    asignarMasMenos(event.target, true)
})

function ingresarCarrito(art){
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
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function actualizarCarrito(){
    const carritoBody = document.querySelector(".carrito-cuerpo");
    carritoBody.innerHTML = ""
    
    let sumaTotal = 0

    if(carrito.length == 0){
        document.getElementById("eliminar-carrito").style.display = "none"
        const footer = document.querySelector(".carrito-footer")
        footer.style.display = "none"

        carritoBody.innerHTML +=  
        `<div class="carrito-emptystate">
            <img src="img/carrito-emptystate.svg" alt="" />
            <p class="empty-titulo">El carrito está vacío</p>
            <p class="empty-texto">Los artículos se agregarán acá luego de apretar “Agregar al carrito” en cada uno de ellos.</p>
            <button type="button" class="btn-primario">Ir a comprar</button>
         </div>`
    }else{
        const footer = document.querySelector(".carrito-footer")
        footer.style.display = "block"
        document.getElementById("eliminar-carrito").style.display = "block"

        for(const c of carrito){
            console.log(c)
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
        
        itemsCarrito.value = carrito.length;
        itemsCarrito.style.display = "none"   
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

