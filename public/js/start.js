document.addEventListener('DOMContentLoaded', (e) => {
    
    socket.on("productos", data => {            
        showArts(data)  
     })
})