import { bancoDiv } from "../bancos/actualizarBancos.js";

/************************/
/* funcion cargar banco */
/************************/
export const getBancos = async () => {
  //buscar el obajeto banco
  if (localStorage.saldoBanco == undefined || localStorage.saldoBanco == "[]") {
    await fetch("../src/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        let saldoBanco = data[1][0]["banco"];
        localStorage.setItem("saldoBanco", saldoBanco);
        //actualizar el banco en el DOM
        bancoDiv();
      });
  } else {
    //actualizar el banco en el DOM
    bancoDiv();
  }
};
