import { servicioDiv } from "./atualizarServicios.js";

/****************************/
/* funcion cargar servicios */
/****************************/
export const getServicios = async () => {
  //buscar los obajetos servicios
  if (localStorage.servicios == undefined || localStorage.servicios == "[]") {
    await fetch("../src/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        let servicios = data[0];
        localStorage.setItem("servicios", JSON.stringify(servicios));
        //actualizar los servicios en el DOM
        servicioDiv();
      });
  } else {
    //actualizar los servicios en el DOM
    servicioDiv();
  }
};
