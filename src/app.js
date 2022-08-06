const date = luxon.DateTime.now();
const url = "https://pokeapi.co/api/v2/pokemon?offset=20&limit=200";
let arrayHisorial = localStorage.arrayHisorial
  ? JSON.parse(localStorage.getItem("arrayHisorial"))
  : [];

import { servicioDiv } from "./componets/servicios/atualizarServicios.js";

import { getServicios } from "./componets/servicios/getServicios.js";

import { getBancos } from "./componets/bancos/getBancos.js";

import { login } from "./login/login.js";

//Funcion para pagar el resvicio selecionado
const pagar = (servicioName, pago) => {
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  let deudaModal = document.querySelector("#deuda-modal");
  let pagoModal = document.querySelector("#pago-modal");
  let saldoBanco = Number(localStorage.getItem("saldoBanco"));

  if (saldoBanco - pago < 0) {
    deudaModal.textContent = `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
    toast("Saldo insuficiente", "E8271A", "C22115");
    arrayHisorial.push({
      servicio: servicioName,
      monto: 0,
      fecha: date.toLocaleString(),
      pago: "fallido",
    });
    localStorage.setItem("arrayHisorial", JSON.stringify(arrayHisorial));
  } else if (result.monto <= 0) {
    deudaModal.textContent =
      Math.sign(result.monto) == -1
        ? `Saldo a favor: ${result.monto * -1}`
        : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
    toast("No registra deuda", "1F27C2", "2630F4");
  } else {
    saldoBanco = saldoBanco - pago;
    result.monto = result.monto - pago;
    deudaModal.textContent =
      Math.sign(result.monto) == -1
        ? `Saldo a favor: ${result.monto * -1}`
        : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
    toast("Operacion Exitosa", "00b09b", "96c93d");
    pagoModal.value = Math.sign(result.monto) == -1 ? 0 : result.monto;
    arrayHisorial.push({
      servicio: servicioName,
      monto: pago,
      fecha: date.toLocaleString(),
      pago: "ok",
    });
    localStorage.setItem("arrayHisorial", JSON.stringify(arrayHisorial));
    localStorage.setItem("servicios", JSON.stringify(servicios));
    localStorage.setItem("saldoBanco", JSON.stringify(saldoBanco));

    actualizarValores(servicioName, null);
  }
};

//Funcion para acutalizar los elementos del DOM despues de cualquiera de las acciones
export const actualizarValores = (servicioName, servicioName2 = undefined) => {
  let boxServicio = undefined;

  servicioName2 && servicioName2 != servicioName
    ? (boxServicio = servicioName2)
    : (boxServicio = servicioName);

  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  let saldoBanco = Number(localStorage.getItem("saldoBanco"));

  if (boxServicio != "banco") {
    let svci = document.getElementById(boxServicio);
    let servicioActualizar =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.firstElementChild
        .nextElementSibling;
    let servicioActualizarName =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.firstElementChild;
    let servicioActualizarBtn =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.firstElementChild
        .nextElementSibling.nextElementSibling.firstElementChild
        .firstElementChild;
    let servicioActualizarBtnHistorial =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.firstElementChild
        .nextElementSibling.nextElementSibling.firstElementChild
        .lastElementChild;
    let servicioActualizarBtnEdit =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.lastElementChild.lastElementChild
        .firstElementChild;
    let servicioActualizarBtnDelet =
      svci.firstElementChild.firstElementChild.firstElementChild
        .firstElementChild.firstElementChild.lastElementChild.lastElementChild
        .lastElementChild;

    servicioActualizar.textContent =
      Math.sign(result.monto) == -1
        ? `Saldo a favor: ${result.monto * -1}`
        : `Total a pagar: ${result.monto}`;
    servicioActualizarName.textContent = `Mi deuda ${result.servicio}.`;
    servicioActualizarBtn.name = `${result.servicio}`;
    servicioActualizarBtn.id = `btn_${result.servicio}`;
    servicioActualizarBtnHistorial.name = `${result.servicio}`;
    servicioActualizarBtnHistorial.id = `btn_${result.servicio}_historial`;
    svci.id = `${result.servicio}`;
    servicioActualizarBtnEdit.name = `${result.servicio}`;
    servicioActualizarBtnDelet.name = `${result.servicio}`;
  }

  let banco = document.getElementById("banco");
  let bancoActualizar =
    banco.firstElementChild.firstElementChild.firstElementChild
      .firstElementChild.firstElementChild.firstElementChild.firstElementChild
      .firstElementChild.nextElementSibling;
  bancoActualizar.textContent = `Saldo disponible $ ${saldoBanco}`;
};

//Funcion para editar los servicios
const editarServicio = (servicioName) => {
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  let oldName = result.servicio;
  let newName = document.getElementById("edit-nombre").value;
  let newDeuda = document.getElementById("edit-saldo").value;

  result.monto = newDeuda;

  if (oldName != newName) {
    result.servicio = newName;
    localStorage.removeItem("servicios");
    servicios = servicios.filter(
      (servicio) => servicio.servicio !== servicioName
    );
  }

  localStorage.setItem("servicios", JSON.stringify(servicios));

  toast("Servicio Editado", "00b09b", "96c93d");
  $("#cerrar-edit").click();
  actualizarValores(newName, oldName);
};

//Funcion para devolver un numero random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//API para conseguir nombres de pokemones
export const obtenerPokem = async () => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let pokemonName = data.results;
      let PalabraSeguridad = document.getElementById("palabra-seguridad");
      PalabraSeguridad.innerText = `${
        pokemonName[getRandomInt(pokemonName.length - 1)].name
      }`;
    });
};

//Funcion para mostar alertas segun corresponda usando Toastify
export const toast = (mensaje, color1, color2) => {
  Toastify({
    text: `${mensaje}`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: `linear-gradient(to right, #${color1}, #${color2})`,
    },
  }).showToast();
};

//clicks en botones del DOM
$("#edit").on("click", function (e) {
  let servicioName = `${$(this).attr("name")}`;
  editarServicio(servicioName);
});

$("#servicios-p").on("click", function (e) {
  $("#modalAdd").modal();
});

$("#add").on("click", function (e) {
  let nombre = $("#add-nombre").val();
  let saldo = Number($("#add-saldo").val());

  nombre == "" && toast("Debe ingresar un nombre", "E8271A", "C22115");
  saldo == "" && toast("Debe ingresar un saldo", "E8271A", "C22115");
  saldo < 0 && toast("El saldo no puede ser negativo", "E8271A", "C22115");

  if (!(nombre == "") && !(saldo < 0 || saldo == "")) {
    toast("Operacion Exitosa", "00b09b", "96c93d");
    let servicios = JSON.parse(localStorage.getItem("servicios"));
    servicios.push({ servicio: nombre, monto: saldo });
    localStorage.setItem("servicios", JSON.stringify(servicios));
    servicioDiv();
    $("#cerrar-add").click();
  }
});

$("#deleted").on("click", function (e) {
  let palabra = document.getElementById("palabra-seguridad").textContent;
  let palabra2 = $("#palabra-seguridad-confirm").val();

  if (palabra == palabra2) {
    let servicioName = `${$(this).attr("name")}`;
    let servicios = JSON.parse(localStorage.getItem("servicios"));
    localStorage.removeItem("servicios");
    servicios = servicios.filter(
      (servicio) => servicio.servicio !== servicioName
    );
    localStorage.setItem("servicios", JSON.stringify(servicios));
    toast("Operacion Exitosa", "00b09b", "96c93d");
    $(`#${servicioName}`)[0].remove();
    $("#cerrar-deleted").click();
    servicioDiv();
  } else {
    toast("Palabra Incorrecta", "E8271A", "C22115");
  }
});

$("#pagar").on("click", function (e) {
  let pago = document.querySelector("#pago-modal").value;
  pagar($(this).val(), pago);
});

$("#reset").on("click", function (e) {
  localStorage.removeItem("servicios");
  localStorage.removeItem("saldoBanco");
  localStorage.removeItem("servicios");
  localStorage.removeItem("arrayHisorial");
  localStorage.removeItem("usuario");

  location.reload();
});

$("#salir").on("click", function (e) {
  location.reload();
});

login();
getServicios();
getBancos();
