/*******************************************/
/* funcion cargar el historal del servicio */
/*******************************************/
export const historialServicios = (servicio) => {
  //elemntos del modal historial
  let divH = document.getElementById("historial-modal");
  let registros = divH.children;
  //obtenet los objetos historal del servicio
  let arrayHisorial = JSON.parse(localStorage.getItem("arrayHisorial"));

  registros.length > 0 && (divH.innerHTML = "");
  //cargar en el DOM los objetos
  arrayHisorial.forEach((element) => {
    if (servicio == element.servicio) {
      let contenedor = document.createElement("p");
      contenedor.innerHTML = `pago de ${element.servicio} por ${element.monto} el dia de ${element.fecha} el pago fue ${element.pago}`;
      divH.appendChild(contenedor);
    }
  });

  $("#modalHistorial").modal();
};
