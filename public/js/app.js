const socket = io.connect();
const mostrador = document.querySelector(".contenedor-articulos")
let stopEmits = false

//socket.on("loading", stopEmits = true)

socket.on("categ-result", data => {
    if(data.succes){
        console.log(data)
        showArts(data.result)
        stopEmits = true
    }else{
        alert("Categoria no valida")
    }    
});

function showArts(art, message){
    
    mostrador.innerHTML = "";

    if(message){
      mostrador.innerHTML = message; 
    }
    art.forEach(p => {
      
      if(p.mostrar){
        
          if(isNaN(p.precio)){
           if(p.precio == String || p.precio.includes(",")){          
            p.precio = p.precio.replace(",", ".");
            p.precio = Number(p.precio); 
           }
          }          
             //<img src="/img/${p.categorias}/${p.imagendetalle}">
      mostrador.innerHTML += `
      <div class="card-articulo">
					<div class="contenedor-img-articulo ${p.codigo}">
                        
          </div>
					<div class="contenedor-info-articulo">
						<h3>${p.nombre}</h3>
						<p class="info-gral-articulo"${p.nombre2}</p>
						<div class="descripcion-titulo">
							<p>Ver descripción</p>
							<button type="button" class="chevron chevron-up"></button>
						</div>
						<p class="descripcion-texto" style="display:none;">${p.descripcion}<br/><span>Código:</span> ${p.codigo}<br/><span>Unidad de venta:</span> ${p.CantidadDeVenta}</p>
						<div class="precio-cantidad">
							<div class="precio-card">
								<p>$${p.precio}</p>
								<p>${p.CantidadDeVenta}</p>
							</div>
							<div class="cantidad-card">
								<button type="button" class="menos"></button>
								<input type="number" value="1">
								<button type="button" class="mas"></button>
							</div>
						</div>
						<button type="button" class="btn-primario">Agregar al carrito</button>
					</div>
				</div>
      `
     
    }   
       
    });

    art.forEach(p => {
      const img = document.querySelector(`".contenedor-img-articulo ${"."+ String(p.codigo)}"`)
      console.log(img)
      //img.style.color = "red"
      img.style.backgroundImage = `url("/img/${p.categorias}/${p.imagendetalle}")`;
    })


mostrador.addEventListener('click', event=>{
    let mouse = event.target;
    if(mouse.classList.contains('botonComprar')){
      const precioValue = mouse.value;
      let titulo = mouse.parentElement.parentElement.childNodes[3].childNodes[1].textContent;     
      let precio = parseFloat(precioValue).toFixed(2);
      
      let codigo = mouse.parentElement.parentElement.childNodes[3].childNodes[7].childNodes[4].textContent;
      codigo = codigo.split(" ")
      codigo = codigo[codigo.length-1];
      
      let cantidad = mouse.parentElement.parentElement.childNodes[3].childNodes[5].childNodes[1].childNodes[5].value;
      cantidad = parseInt(cantidad);
      let imagen = mouse.parentElement.parentElement.childNodes[1].src      
      const articulo = {codigo: codigo, titulo: titulo, precio: precio, cantidad: cantidad, imagen: imagen}
      
      checkColores(articulo);
    }    
    if(mouse.classList.contains('fa-plus-circle')){
      let cantidad = mouse.parentElement.previousElementSibling.value++;
    }  
    if(mouse.classList.contains('fa-minus-circle')){    
      let cantidad = mouse.parentElement.previousElementSibling.value;
      if(cantidad > 1){
        cantidad = mouse.parentElement.previousElementSibling.value--;
      }
    }

    if(mouse.classList.contains('fqa')){
      barraFQA(mouse);
    }
  })
  stopEmits = false
}

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

document.addEventListener('DOMContentLoaded', (e) => {
    console.log(stopEmits)
    if(stopEmits == false){
        socket.on("productos", data => {            
            showArts(data)  
         })
    }
})

//carrito
//abrir carrito
document.querySelector(".carrito").addEventListener('click', event=>{
  const carrito = document.querySelector(".drawer-carrito")
  carrito.style.display = "block"
})

document.querySelector(".drawer-carrito").addEventListener('click', event=>{
  //cerrar carrito
  const cerrar = document.querySelector(".drawer-carrito")
  cerrar.style.display = "none"
})