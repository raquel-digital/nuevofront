//local storage
//const carrito = localStorage.getItem("carrito");
const carrito = []
//contador de items
const itemsCarrito = document.querySelector("#carritoNumber")
itemsCarrito.value = carrito.length;

//agregar al carrito
mostrador.addEventListener('click', event=>{
    const mouse = event.target
    if(mouse.id == "articulo-compra"){
        //seleccionar boton con datos
        const clases = event.target.classList//returns arreglo con las clase
        const boton = document.querySelector("." + clases[1]);

        const art = {
            codigo: boton.getAttribute("codigo"),
            precio: boton.getAttribute("precio"),
            nombre: boton.getAttribute("nombre"),
            imagen: boton.getAttribute("imagen")
        }

        carrito.push(art);
        itemsCarrito.textContent = carrito.length;
        console.log(itemsCarrito)
    }
})


//abrir carrito
document.querySelector(".carrito").addEventListener('click', event=>{
    const carritoBody = document.querySelector(".carrito-cuerpo");
    carritoBody.innerHTML = ""

    for(const c of carrito){
        carritoBody.innerHTML += `
            <div class="carrito-item">
            <div class="contenedor-img-carrito" style="background-image: url(${c.imagen});"></div>
            <div>
                <p class="item-titulo">${c.nombre}</p>
                <p class="item-precio">$${c.precio}</p>
            </div>
            <div class="cantidad-card">
                <button type="button" class="menos"></button>
                <input type="number" value="0">
                <button type="button" class="mas"></button>
                <a class="eliminar-link">Eliminar</a>
            </div>
            <button type="button" class="eliminar"><span class="tooltip-eliminar">Eliminar</span></button>
            </div>
        `
    }
    
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
})


