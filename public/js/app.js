const socket = io.connect();
const mostrador = document.querySelector(".contenedor-articulos")
let mostradorDeArticulos;
let mostradorDeArticulosPaginador;

//Clicks en mostrador
mostrador.addEventListener('click', event=>{
    const mouse = event.target
    
    //agregar al carrito
    if(mouse.classList.contains("articulo-compra")){

        //seleccionar boton con datos
        const clases = event.target.classList//returns arreglo con las clase
        const boton = document.querySelector("." + clases[1]);
        const cantidad_venta = mouse.parentElement.childNodes[9].childNodes[3].childNodes[3].value
              
        const art = {            
            codigo: boton.getAttribute("codigo"),
            precio: boton.getAttribute("precio"),
            titulo: boton.getAttribute("nombre"),
            imagen: boton.getAttribute("imagen"),
            cantidad: Number(cantidad_venta) 
          }
        if(mouse.textContent == "Ver Carta De Colores"){
          //TODO medidas
          modalColores.style.display = "block"
          const colores = boton.getAttribute("colores")
          cargarColores(art, colores)
        }else{
          ingresarCarrito(art)
          mostrarToats("Artículo agregado con exito")
        }      
    }

    //abrir y cerrar descripcion de artículo    
    if(mouse.classList.contains("chevron")){
        if(mouse.classList.contains("chevron-up")){        
            mouse.classList.remove("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "none"
        }else{
            mouse.classList.add("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "block"
        }
    }    

    if(mouse.textContent == "Ver descripción"){
        if( !mouse.nextElementSibling.classList.contains("chevron-up")){
            mouse.nextElementSibling.classList.add("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "block"
        }else{
            mouse.nextElementSibling.classList.remove("chevron-up")
            const mostrar = mouse.parentElement.nextElementSibling
            mostrar.style.display = "none"
        }        
    }

    //asigna + o - en articulo
    asignarMasMenos(mouse)

    //modal imagen
    if(mouse.classList.contains("contenedor-img-articulo")){     
      const boton = document.querySelector("#" + mouse.id);
      const imagen = boton.getAttribute("imagen");
      const nombre = boton.getAttribute("nombre");
      const modal = document.querySelector(".modal-img-ampliada")
      modal.children[1].children[0].textContent = nombre
      modal.children[1].children[1].src = imagen
      modal.style.display = "block"
    }
})

//clicks en modal cierra imagen
document.querySelector(".modal-img-ampliada").addEventListener('click', () => {
    const modal = document.querySelector(".modal-img-ampliada")
    modal.style.display = "none"  
})

//Filtros Tags
const filtros = document.querySelector(".filtros")
if(filtros){
    filtros.addEventListener('click', event=>{
        const mouse = event.target
        
        if(mouse.classList.contains("hashtag")){   
          
            mostrador.innerHTML = "";
          
            let articulosTags = []
            const clik = mouse.textContent;
            const clikTag = mouse.textContent.replaceAll(" ", "-");      
            
            for(let p of mostradorDeArticulos){ 
              p.tags = p.tags.replaceAll(" ", "-");
                                
                let codigo = p.tags;         
              
                if(codigo.includes(clikTag)){
                  articulosTags.push(p);
                }
          }
            
            loadTag(articulosTags, clik);
          }
    })
}


//TAGS

function tags(art){
    let tagCheck= []
    const botonera = document.querySelector(".filtros")
    botonera.innerHTML = `<h2 style="margin-bottom: 12rem;">Filtrar por:</h2>`;
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
  }

//Cargar TAGS de artículos
function loadTag(articulosTags, target){ 
  let nuevoQueryString
  let queryString = window.location.search;

  if(queryString.includes("tag")){
    const split = queryString.split("&")
    nuevoQueryString = split[0] + "&tag="+target;
  }else{
    nuevoQueryString = queryString + "&tag="+target;
  }
  // Actualizar la URL en la barra de direcciones sin recargar la página
  window.history.replaceState({}, "", nuevoQueryString);

    const tags = document.querySelectorAll(".hashtag")
    tags.forEach(e => {        
        if(e.classList.contains("tag-seleccionado")){
            e.classList.remove("tag-seleccionado")
        }
        if(e.textContent == target){
            e.classList.add("tag-seleccionado")
        }
    })
    
    paginador.innerHTML = ""

    if(articulosTags.length > indice){                
        crearPaginador(articulosTags);
    }else{        
        showArts(articulosTags);
    }
  
    if(mostrador.innerHTML === ""){
      mostrador.innerHTML += `
          <h1>NO HAY RESULTADOS</h1>
          `
    }
}

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
            c.cantidad = cant        }
    }
    actualizarCarrito()
}

  //PAGINADOR
  function crearPaginador(arr){
    paginador.innerHTML = ""

    //const paginadorArray = mostradorDeArticulos.filter(e => e.mostrar);
    const paginadorArray = arr.filter(e => e.mostrar);    
    
    let i = paginadorArray.length / indice;
    
        let num = 1
        
        while(i > 0){
            
            
            paginador.innerHTML +=  `<button type="button" class="pagina" onclick="asignadorPaginador(${num})">${num}</button>`

            num++;
            
            i--;
        }
        
        mostradorDeArticulosPaginador = arr
        asignadorPaginador(1);              
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
   
    const arrayIndiceMap = mostradorDeArticulosPaginador.slice(start, end);

    // Calcula la posición de la sección
    var posicion = mostrador.getBoundingClientRect().top + window.scrollY + -150;

    // Realiza el desplazamiento suave hasta la posición de la sección
    window.scrollTo({
        top: posicion,
        behavior: "smooth" // Animación suave
    });
      
    showArts(arrayIndiceMap);  
  }

  function mostrarToats(txt){
    const toast = document.querySelector(".toast-exito")
    toast.innerHTML = `
        <img src="img/tilde.svg" alt="">
        <p>${txt}</p>
    `
    toast.style.display = "block"
    setTimeout(function() {
        toast.style.display = "none";
    }, 1300);
  }

  //Modal colores
  const modalColores = document.querySelector(".modal-carta-colores")
  modalColores.addEventListener("click", e => {
    const mouse = e.target
    asignarMasMenos(mouse)
    //activar checkbox con + o -
    if(mouse.classList.contains("mas") || mouse.classList.contains("menos")){
      const checkBox = mouse.parentElement.parentElement.parentElement.children[2].children[1]
      checkBox.checked = true
      const cantidad = mouse.parentElement.parentElement.parentElement.children[1].children[1].children[1]
      if(cantidad.value > 0){
        mouse.parentElement.parentElement.parentElement.classList.add("color-seleccionado")
        checkBox.checked = true
      }else{
        mouse.parentElement.parentElement.parentElement.classList.remove("color-seleccionado")
        checkBox.checked = false
      } 
      //TODO funcion que quite el seleccionado
      document.getElementById("modal-colores").removeAttribute("disabled");
    }
    if(mouse.checked){
      const cantidad = mouse.parentElement.parentElement.children[1].children[1].children[1]
      if(cantidad.value == 0){
        cantidad.value = 1
      }     
      //TODO funcion que quite el seleccionado
      mouse.parentElement.parentElement.classList.add("color-seleccionado")
      
      document.getElementById("modal-colores").removeAttribute("disabled");
    }
    //CERRAR MODAL
    if(mouse.id == "cerrar-modal"){
      modalColores.style.display = "none"
    }
    if(mouse.classList.contains("modal-carta-colores")){
      modalColores.style.display = "none"
    }
    //Confirmar Compra
    if(mouse.id == "modal-colores"){
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      
        checkboxes.forEach(function(checkbox) {
          if (checkbox.checked) {
             const boton = document.getElementById("modal-colores")
             const click = checkbox.parentElement.parentElement.firstElementChild.classList 
             const imagen = click[2] 
             const codigo = click[3]
             const cantidad = checkbox.parentElement.parentElement.children[1].children[1].children[1].value
             
             const art = {
               codigo: codigo,
               imagen: imagen,
               precio: boton.getAttribute("precio"),
               titulo: boton.getAttribute("nombre"),
               cantidad: Number(cantidad)
             };

             ingresarCarrito(art)
             mostrarToats("Artículo agregado con exito")
             modalColores.style.display = "none"
          }
        })
    }
  })

  function cargarColores(art, colores){
    
    const arrColores = JSON.parse(colores)
    
    const modalContenidoColor = document.getElementById("contenido-modal")
    modalContenidoColor.innerHTML = ""

    arrColores.forEach( e => {
      if(e.mostrar){
        const split = e.codigo.split("-")
        let color = split[1]
        if(split.length > 2){        
          for (let index = 2; index < split.length; index++) {
            color += " " + split[index]
          }
        }

        const splitImg = art.imagen.split("/")
        const imagen = "/img/" + splitImg[2] + "/" + e.color

        modalContenidoColor.innerHTML += `
        <div class="card-articulo">
        <div id="modal-color${e.codigo}" class="contenedor-img-articulo img-color ${imagen} ${e.codigo}" style="background-image:url(${imagen});"></div>
        <div class="color-info">
            <h3>${color}</h3>
            <div class="cantidad-card">
                <button type="button" class="menos"></button>
                <input type="number" value="0">
                <button type="button" class="mas"></button>
            </div>
        </div>
        <div class="seleccionar-color">
            <label for="">Seleccionar</label>
            <input type="checkbox" id="" value="">
        </div>
        </div>
        `
      }
    }) 

   //setear atributos al boton de confirmar TEST
   const boton = document.getElementById("modal-colores")
   boton.setAttribute("precio", art.precio);
   boton.setAttribute("nombre", art.titulo);

   modalContenidoColor.addEventListener("click", event => {
    if(event.target.classList.contains("contenedor-img-articulo")){     
      const click = event.target.classList;
      const imagen = click[2]
      const nombre = art.nombre;
      const modalContenidoColorApliada = document.querySelector("#apmliada-en-modal")
      modalContenidoColorApliada.children[1].children[0].textContent = nombre
      modalContenidoColorApliada.children[1].children[1].src = imagen
      modalContenidoColorApliada.style.display = "block"
    }
   })
   
  }





