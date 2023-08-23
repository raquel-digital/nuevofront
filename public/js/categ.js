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
              asignadorPaginador(1);              
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

function tags(art){
    let tagCheck= []
    const botonera = document.querySelector(".filtros")
    botonera.innerHTML = `<h2>Filtrar por:</h2>
    `;
    botonera.innerHTML += `<button type="button" class="tag hashtag">inicio</button>`;
    for(let t of art){  
            
          if(t.tags.includes(" ")){          
            const tagSplit = t.tags.split(" ");          
            tagSplit.forEach(e => {
              if(!tagCheck.includes(e) && t.tags != "" && e != "" && t.mostrar){
                  tagCheck.push(e);
              }
            })
          }else{
            if(!tagCheck.includes(t.tags) && t.tags != "" && t.tags != " " && t.mostrar){
              tagCheck.push(t.tags);
           }
          }
          
    }
    tagCheck = tagCheck.sort()
    
    for(let t  of tagCheck){
      if(t.includes("-")){
        t = t.replaceAll("-", " ");
      }
      botonera.innerHTML += `<button type="button"  class="tag hashtag">${t}</button>`
    }
  
    //botonera.innerHTML += `<button class="hashtagAll">todos los articulos</button>`;
    
  }


  //PAGINADOR
  function crearPaginador(){
    const paginadorArray = mostradorDeArticulos.filter(e => e.mostrar);    
    
    let i = paginadorArray.length / indice;
    
        let num = 1
        
        while(i > 0){
            
            
            paginador.innerHTML +=  `<button type="button" class="pagina" onclick="asignadorPaginador(${num})">${num}</button>`

            num++;
            
            i--;
        }
  }

  function asignadorPaginador(i){
    const paginador = document.querySelectorAll(".pagina")

    paginador.forEach(e => {
      if(e.classList.contains("pagina-elegida")){
        e.classList.remove("pagina-elegida")
      }
      
      if(e.textContent == i){        
        e.classList.add("pagina-elegida")
      }
    })
  
    const start = (i * indice) - indice;
    const end = i * indice;
   
    const arrayIndiceMap = mostradorDeArticulos.slice(start, end); 

    // Calcula la posición de la sección
    var posicion = mostrador.getBoundingClientRect().top + window.scrollY + -150;

    // Realiza el desplazamiento suave hasta la posición de la sección
    window.scrollTo({
        top: posicion,
        behavior: "smooth" // Animación suave
    });
      
    showArts(arrayIndiceMap);  
  }
  
