import { toast } from "../app.js";

let title = document.getElementById("title-login");
let descripcion = document.getElementById("descrp-login");
let usuario = localStorage.usuario ? JSON.parse(localStorage.usuario) : [];
let name = document.getElementById("nombre-user");
let contraseña = document.getElementById("pass-user");
let btnLogin = document.getElementById("btn-login");

//cargar el modal de login
export function login() {
  title.innerText = usuario.length > 0 ? `Bienvenido` : `Registro`;

  descripcion.innerText =
    usuario.length > 0
      ? `Ingresa tu usuario y contraseña.`
      : `Ingrese el "nombre" y "contraseña" que desdes.`;

  btnLogin.innerText = usuario.length > 0 ? "Iniciar" : "Registar";
  $("#modalLogin").modal();
}

$("#btn-login").on("click", function (e) {
  if (usuario.length) {
    name.value == usuario[0].name && contraseña.value == usuario[0].contraseña
      ? ($("#modalLogin").modal("hide"),
        toast("Bienvenido", "00b09b", "96c93d"))
      : toast("Usuario o Contraseña incorrecta", "E8271A", "C22115");
  } else {
    if (name.value.length > 0 && contraseña.value.length > 0) {
      usuario.push({ name: name.value, contraseña: contraseña.value });
      localStorage.setItem("usuario", JSON.stringify(usuario));
      toast("Bienvenido", "00b09b", "96c93d");
      $("#modalLogin").modal("hide");
    } else {
      name.value.length == 0 &&
        toast("Debe completar el Nombre", "E8271A", "C22115");

      contraseña.value.length == 0 &&
        toast("Debe completar la contraseña", "E8271A", "C22115");
    }
  }
});
