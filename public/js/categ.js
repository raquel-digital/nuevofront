const paginador = document.querySelector(".paginador")
const indice = 50

document.addEventListener('DOMContentLoaded', (e) => {
    socket.on("categ-result", data => {
        if(data.succes){        
            mostrador.innerHTML = ""
            mostradorDeArticulos = data.result.sort(function (a, b) {
              if (a.id > b.id) {
                return 1;
              }
              if (a.id < b.id) {
                return -1;
              }
              
              return 0;
            }).reverse();


            if(mostradorDeArticulos.length > indice){        
              crearPaginador(mostradorDeArticulos);
              tags(mostradorDeArticulos);
            }
            else{ 
              showArts(mostradorDeArticulos);
              tags(mostradorDeArticulos);
            } 

          const categoria = document.querySelectorAll("#select-categ ul li a")  
          categoria.forEach(e => {
            if(e.classList.contains("categoria-elegida")){
              e.classList.remove("categoria-elegida")
            }
            if(e.textContent == data.categ){              
              e.classList.add("categoria-elegida")
            } 
          })
                
        }else{
            alert("Categoria no valida")
        }    
    });
})
socket.on("resultado-vacio", () => {
  const barra =  document.getElementById("barra-busqueda")
  barra.classList.add("buscador-error")
});


  
