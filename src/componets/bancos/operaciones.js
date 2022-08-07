import { toast } from "../../app.js";
import { actualizarValores } from "../../app.js";

const date = luxon.DateTime.now();

/****************************************/
/* funcion para operaciones en el banco */
/****************************************/
export const banco = (operacion, saldo) => {
  //get valores modal banco
  let saldoBanco = Number(localStorage.getItem("saldoBanco"));
  let saldoDisponible = document.querySelector("#banco-modal");
  let arrayHisorialBanco = localStorage.arrayHisorialBanco
    ? JSON.parse(localStorage.getItem("arrayHisorialBanco"))
    : [];

  //identificar deposito o extraccion
  if (operacion == "Deposito") {
    saldoBanco = saldoBanco + Number(saldo);
    saldoDisponible.textContent = `Saldo disponible: ${saldoBanco}`;
    toast("Operacion Exitosa", "00b09b", "96c93d");
    arrayHisorialBanco.push({
      operacion: operacion,
      monto: saldo,
      fecha: date.toLocaleString(),
      estado: "ok",
    });
    //Guardar nuevos valores
    localStorage.setItem("saldoBanco", saldoBanco);
    //actualizar DOM
    actualizarValores("banco");
  } else {
    //si el saldo no alcanza para la extraccion
    if (saldoBanco - Number(saldo) < 0) {
      saldoDisponible.textContent = `Saldo disponible: ${saldoBanco}`;
      toast("Saldo insuficiente", "E8271A", "C22115");
      arrayHisorialBanco.push({
        operacion: operacion,
        monto: saldo,
        fecha: date.toLocaleString(),
        estado: "ok",
      });
    } else {
      saldoBanco = saldoBanco - saldo;
      saldoDisponible.textContent = `Saldo disponible: ${saldoBanco}`;
      toast("Operacion Exitosa", "00b09b", "96c93d");
      arrayHisorialBanco.push({
        operacion: operacion,
        monto: saldo,
        fecha: date.toLocaleString(),
        estado: "ok",
      });
      //Guardar nuevos valores
      localStorage.setItem("saldoBanco", saldoBanco);
      //actualizar DOM
      actualizarValores("banco");
    }
  }
  localStorage.setItem(
    "arrayHisorialBanco",
    JSON.stringify(arrayHisorialBanco)
  );
};
