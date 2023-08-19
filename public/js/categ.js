document.addEventListener('DOMContentLoaded', (e) => {
    socket.on("categ-result", data => {
        if(data.succes){
            mostrador.innerHTML = ""
            showArts(data.result)
            tags(data.result) 
            mostradorDeArticulos = data.result //guardamos los articulos para filtrar     
        }else{
            alert("Categoria no valida")
        }    
    });
    socket.on("resultado-busqueda", data => {        
        document.getElementById("resultado-router").innerHTML = `<h1>Resultados de búsqueda para <span class="resultado-busqueda">“${data.query}”</span></h1>`
        showArts(data.result)        
    })
})

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
