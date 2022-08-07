const date = luxon.DateTime.now(); //fecha de hoy
const url = "https://pokeapi.co/api/v2/pokemon?offset=20&limit=200"; //URL para la api
let arrayHisorial = localStorage.arrayHisorial
  ? JSON.parse(localStorage.getItem("arrayHisorial"))
  : [];

import { servicioDiv } from "./componets/servicios/atualizarServicios.js";

import { getServicios } from "./componets/servicios/getServicios.js";

import { getBancos } from "./componets/bancos/getBancos.js";

import { login } from "./login/login.js";

/**************************/
/* Funcion pagar resvicio */
/**************************/
const pagar = (servicioName, pago) => {
  //Buscar el objeto servicio dentro del array
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  //get valores del modal
  let deudaModal = document.querySelector("#deuda-modal");
  let pagoModal = document.querySelector("#pago-modal");
  //get saldo del banco
  let saldoBanco = Number(localStorage.getItem("saldoBanco"));

  //si el saldo del banco no alcanza para pagar
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
    //si se paga mas de lo que se debia
  } else if (result.monto <= 0) {
    deudaModal.textContent =
      Math.sign(result.monto) == -1
        ? `Saldo a favor: ${result.monto * -1}`
        : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
    toast("No registra deuda", "1F27C2", "2630F4");
    //pago total o parcial del servicio
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
    //guardar los nuevos valores
    localStorage.setItem("arrayHisorial", JSON.stringify(arrayHisorial));
    localStorage.setItem("servicios", JSON.stringify(servicios));
    localStorage.setItem("saldoBanco", JSON.stringify(saldoBanco));
    //actualizar el DOM
    actualizarValores(servicioName, null);
  }
};

/*****************************/
/* Funcion actualizar el DOM */
/*****************************/
export const actualizarValores = (servicioName, servicioName2 = undefined) => {
  //DOM donde esta el servicio a editar
  let boxServicio = undefined;
  servicioName2 && servicioName2 != servicioName
    ? (boxServicio = servicioName2)
    : (boxServicio = servicioName);

  //objeto servicio donde ontengo los nuevos valores
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  let saldoBanco = Number(localStorage.getItem("saldoBanco"));

  //En caso de solo modificar el DOM del banco
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

/******************************/
/* Funcion editar el servicio */
/******************************/
const editarServicio = (servicioName) => {
  //obtener el objeto servicio selecionado
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == servicioName;
  });
  let result = results.length > 0 ? results[0] : null;
  //get nombre y deuda del servicio
  let oldName = result.servicio;
  let newName = document.getElementById("edit-nombre").value;
  let newDeuda = document.getElementById("edit-saldo").value;
  result.monto = newDeuda;

  //en caso de editar el nombre
  if (oldName != newName) {
    result.servicio = newName;
    localStorage.removeItem("servicios");
    servicios = servicios.filter(
      (servicio) => servicio.servicio !== servicioName
    );
  }
  //guardar cambios
  localStorage.setItem("servicios", JSON.stringify(servicios));
  toast("Servicio Editado", "00b09b", "96c93d");
  $("#cerrar-edit").click();
  //Actualizar el DOM
  actualizarValores(newName, oldName);
};

/*************************/
/* Funcion numero random */
/*************************/
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/************************************/
/* Funcion API nombres de pokemones */
/************************************/
export const obtenerPokem = async () => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //listado de nombres
      let pokemonName = data.results;
      //elegir un nombre random para la palabra de seguridad
      let PalabraSeguridad = document.getElementById("palabra-seguridad");
      PalabraSeguridad.innerText = `${
        pokemonName[getRandomInt(pokemonName.length - 1)].name
      }`;
    });
};

/************************/
/* Funcion para alertas */
/************************/
export const toast = (mensaje, color1, color2) => {
  //envio mensaje y gradiente de colores segun corresponda
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

/**********************/
/* editar un servicio */
/**********************/
$("#edit").on("click", function (e) {
  //identificar el servicio y llamar a la funcion para editar
  let servicioName = `${$(this).attr("name")}`;
  editarServicio(servicioName);
});

/**************************/
/* modal agregar servicio */
/**************************/
$("#servicios-p").on("click", function (e) {
  $("#modalAdd").modal();
});

/*****************************/
/* agregar un nuevo servicio */
/*****************************/
$("#add").on("click", function (e) {
  //get nuevos valores
  let nombre = $("#add-nombre").val();
  let saldo = Number($("#add-saldo").val());

  //verificar que el nuevo servicio no exista
  let existe = true;
  let servicios = JSON.parse(localStorage.getItem("servicios"));
  let results = servicios.filter(function (servicio) {
    return servicio.servicio == nombre;
  });
  let result = results.length > 0 ? results[0] : null;

  if (result) {
    result.servicio == nombre &&
      (toast("El servicio ya existe", "E8271A", "C22115"), (existe = false));
  }

  //verificar que el nombre no este vacio
  nombre == "" && toast("Debe ingresar un nombre", "E8271A", "C22115");

  //verificar que el saldo no este vacio ni sea menor que cero
  saldo == "" && toast("Debe ingresar un saldo", "E8271A", "C22115");
  saldo < 0 && toast("El saldo no puede ser negativo", "E8271A", "C22115");

  //Guardar nuevo servicio
  if (!(nombre == "") && !(saldo < 0 || saldo == "") && existe) {
    toast("Operacion Exitosa", "00b09b", "96c93d");
    let servicios = JSON.parse(localStorage.getItem("servicios"));
    servicios.push({ servicio: nombre, monto: saldo });
    localStorage.setItem("servicios", JSON.stringify(servicios));

    $("#add-nombre").val("");
    $("#add-saldo").val("");
    servicioDiv();
    $("#cerrar-add").click();
  }
});

/************************/
/* eliminar un servicio */
/************************/
$("#deleted").on("click", function (e) {
  //palabras generdara por la api y palabra escrita por el usuario
  let palabra = document.getElementById("palabra-seguridad").textContent;
  let palabra2 = $("#palabra-seguridad-confirm").val();

  //elimiar el servicio si las palabras coinciden
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

/*********************/
/* pagar un servicio */
/*********************/
$("#pagar").on("click", function (e) {
  //identificar el servicio y llamar a la funcion para pagar
  let pago = document.querySelector("#pago-modal").value;
  pagar($(this).val(), pago);
});

/*********/
/* reset */
/*********/
$("#reset").on("click", function (e) {
  //vaciar todo lo del localStorage y volver a cargar la pagina
  localStorage.removeItem("servicios");
  localStorage.removeItem("saldoBanco");
  localStorage.removeItem("servicios");
  localStorage.removeItem("arrayHisorial");
  localStorage.removeItem("usuario");
  location.reload();
});

/*********/
/* salir */
/*********/
$("#salir").on("click", function (e) {
  //volver a cargar la pagina
  location.reload();
});

login();
getServicios();
getBancos();
