document.addEventListener('DOMContentLoaded', (e) => {
    
    socket.on("productos", data => {            
        showArts(data)  
     })

     if(carrito.length > 0){   
        
        carrito.forEach(e => {
            ingresarCarrito(e)
        });
     }
})