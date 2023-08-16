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

document.addEventListener('DOMContentLoaded', (e) => {
    console.log(stopEmits)
    if(stopEmits == false){
        socket.on("productos", data => {            
            showArts(data)  
         })
    }
})



