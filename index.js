const info = document.getElementById("info"); 
const estadistica = document.getElementById("estadistica"); 
const titulo = document.getElementById("titulo-info"); 
const texto = document.getElementById("texto-info"); 
const menu = document.getElementById("menu"); 
const menuFiltro = document.getElementById("filtrosVid"); 
const btnAnim = document.getElementById("BAnimacion"); 
const btnInfo = document.getElementById("BInfo"); 
const btnVideo = document.getElementById("BVideo"); 
const btnTrivia = document.getElementById("BTrivia"); 
const btnEstadistica = document.getElementById("BEstadistica"); 
const trivia = document.getElementById("contenedor-trivia"); 
const pregunta = document.getElementById("pregunta"); 
const opciones = document.getElementById("opciones"); 

let data = {}; 
let dataTrivia= {}; 
let dataEstadistica={}; 
let currentTarget = null; 
let currentTargetNum = null; 
let modeloActivo = null; 
let Paises=[]; 
let modeloEstatico=true; 
let video = null; 

fetch("estadisticas.json")
.then((res)=>res.json())
.then((json)=>{
  dataEstadistica=json; 
})
.catch((err)=>console.error("Error cargando estadisticas.json: ", err)); 

fetch("info.json")
.then((res)=>res.json())
.then((json)=>{
  data=json; 
})
.catch((err)=>console.error("Error cargando info.json: ", err)); 

fetch("trivia.json")
.then((res)=>res.json())
.then((json)=>{
dataTrivia=json; 
Paises = Object.keys(dataTrivia); 
})
.catch((err)=> console.error("Error cargando trivia.json: ", err)); 


// TARGETS DETECTADOS 

function targetPais(pais, cant, videoID){
  for(let i=1; i<=cant; i++){
const target = document.getElementById(`target${i}-${pais}`); 

target.addEventListener("targetFound", ()=>{
modeloEstatico=true; 
currentTarget = pais; 
currentTargetNum=cant; 
video = document.getElementById(videoID); 
menu.style.display="block"; 
modeloActivo=document.getElementById(`anim-${pais}${i}`);
modeloActivo.setAttribute("visible", "true"); 
modeloActivo.removeAttribute("animation-mixer"); 
}); 


target.addEventListener("targetLost", ()=>{
currentTarget=null; 
currentTargetNum=null; 
desactivarVideo(video); 
video=null; 
menu.style.display="none"; 
info.style.display="none"; 
estadistica.style.display="none"; 
modeloActivo.setAttribute("visible", "false"); 
modeloActivo=null; 
}); 
  }

}
targetPais("argentina", 3, "video-mex-arg"); 

document.querySelectorAll("#filtrosVid button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const filtro= btn.getAttribute("data-filter"); 
    
    if(video){
      video.className=""; 
      video.classList.add(`filter-${filtro}`); 
    }
  }); 
})

btnAnim.addEventListener("click", ()=>{
if(modeloActivo){ 
  info.style.display="none";
  estadistica.style.display="none";
  trivia.style.display="none";
  desactivarVideo(video); 
  modeloActivo.setAttribute("visible", "true"); 
  if(modeloEstatico){
    modeloActivo.removeAttribute("animation-mixer"); 
  modeloActivo.setAttribute("animation-mixer", {clip: "*", loop: "repeat"});
  modeloEstatico=false; 
  }else {
    modeloActivo.removeAttribute("animation-mixer"); 
    modeloEstatico=true; 
  }
   
}
}); 

btnVideo.addEventListener("click", ()=>{
if(!currentTarget) return; 
 modeloActivo.setAttribute("visible", "false"); 
  info.style.display="none";
  estadistica.style.display="none";
  trivia.style.display="none";
  menuFiltro.style.display="block"; 
  if(video){
    video.style.display="block"; 
    video.muted = true; 
    video.playsInline = true; 

    video.pause(); 
    video.currentTime = 0; 

    video.oncanplay=()=>{
      video.play().catch(err=> console.log("Error al reproducir el video: ", err)); 
    }; 
  }
  
}); 

function desactivarVideo(video){
  menuFiltro.style.display="none"; 
  if(video){
    video.style.display="none";
    video.className="";
    video.pause(); 
    video.currentTime = 0; 
    video.muted = true; 
  }
}

btnInfo.addEventListener("click", ()=>{
if(modeloActivo){
  modeloActivo.setAttribute("visible", "false"); 
  info.style.display="block";
  estadistica.style.display="none";
  trivia.style.display="none";
  desactivarVideo(video)
  if(currentTarget && data){
    const pais = data[currentTarget]; 
    titulo.textContent = pais?.titulo || "Equipo"; 
    texto.textContent = pais?.texto || "No hay informacion del pais"; 
    info.style.display="block"; 
  }else return; 
}
}); 


btnEstadistica.addEventListener("click", ()=>{
if(modeloActivo){
  modeloActivo.setAttribute("visible", "false"); 
  info.style.display="none";
  trivia.style.display="none";
  desactivarVideo(video)
  if(currentTarget && dataEstadistica){
    const pais = dataEstadistica[currentTarget]; 
    document.getElementById("titulo-pais").textContent = pais.Pais; 
    document.getElementById("texto-rank").textContent = `Ultimo Ranking en la FIFA: ${pais["Ultimo Ranking en la FIFA"]}`; 
    document.getElementById("texto-primerMundial").textContent = `Primera participación: ${pais["Primera participación"]}`;  
    document.getElementById("texto-mejorResult").textContent = `Mejores resultados: ${pais["Mejores resultados"]}`; 
    document.getElementById("texto-copas").textContent = `Copas del mundo: ${pais["Copas del mundo"]}`; 
    document.getElementById("texto-ganados").textContent = `Partidos ganados: ${pais["Partidos ganados"]}`;
    document.getElementById("texto-perdidos").textContent =  `Partidos perdidos: ${pais["Partidos perdidos"]}`;
    document.getElementById("texto-empatados").textContent = `Partidos empatados: ${pais["Partidos empatados"]}`; 
    estadistica.style.display="block"; 
  }else return; 
}
}); 


 let score=0; 
btnTrivia.addEventListener("click", ()=>{

  if(modeloActivo){
  modeloActivo.setAttribute("visible", "false"); }
  info.style.display="none";
  estadistica.style.display="none";
  desactivarVideo(video)
let paisRandom = Paises[Math.floor(Math.random()*Paises.length)];
trivia.style.display="block"; 
mostrarPregunta(dataTrivia[paisRandom], 0); 

}); 

 function mostrarPregunta(triviaPais, index){
  if(!triviaPais || index >= triviaPais.length){
    pregunta.textContent=`Terminaste la trivia. Has acertado en ${score} preguntas de ${triviaPais.length}`;
    opciones.innerHTML=""; 
    score=0; 
    return; 
  }
  const preguntaActual= triviaPais[index]; 
  pregunta.textContent= preguntaActual.pregunta; 
  opciones.innerHTML=""; 

    preguntaActual.opc.forEach((resp,i)=>{
      const opc = document.createElement("button"); 
      opc.textContent= resp; 
      opc.className="btn btn-outline-primary m-1"; 

      opc.onclick= ()=>{
        console.log(resp); 
  
        if(i=== preguntaActual.answ){
          opc.classList.replace("btn-outline-primary", "btn-success"); 
          score++; 
        }else 
          opc.classList.replace("btn-outline-primary", "btn-danger"); 
        opciones.querySelectorAll("button").forEach(b => b.disabled = true);

      setTimeout(()=>{mostrarPregunta(triviaPais, index+1);}, 1000); 
      }

      opciones.appendChild(opc); 
    })
 }
