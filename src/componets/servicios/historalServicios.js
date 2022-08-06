export const historialServicios = (servicio) => {
  let divH = document.getElementById("historial-modal");
  let registros = divH.children;
  let arrayHisorial = JSON.parse(localStorage.getItem("arrayHisorial"));

  registros.length > 0 && (divH.innerHTML = "");

  arrayHisorial.forEach((element) => {
    if (servicio == element.servicio) {
      let contenedor = document.createElement("p");
      contenedor.innerHTML = `pago de ${element.servicio} por ${element.monto} el dia de ${element.fecha} el pago fue ${element.pago}`;
      divH.appendChild(contenedor);
    }
  });

  $("#modalHistorial").modal();
};
