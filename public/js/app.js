const socket = io.connect();
const mostrador = document.querySelector(".contenedor-articulos")

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



