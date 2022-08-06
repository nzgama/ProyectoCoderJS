import { toast } from "../app.js"

let title = document.getElementById('title-login');
let descripcion = document.getElementById('descrp-login');
let usuario = localStorage.usuario ? JSON.parse(localStorage.usuario) : [];
let name = document.getElementById('nombre-user');
let contraseña = document.getElementById('pass-user');

export function login() {

    title.innerText = usuario.length > 0 ? `Bienvenido` : `Login Registro`;
    descripcion.innerText = usuario.length ? `` : `Como es la primera vez, ingrese el "nombre" y "contraseña" que desdes.`;

    //$("#modalLogin").modal();

}

$('#login-btn').on('click', function (e) {

    if (usuario.length) {

        (name.value == usuario[0].name && contraseña.value == usuario[0].contraseña) ? ($("#modalLogin").modal('hide'), toast("Bienvenido", "00b09b", "96c93d")) : toast("Usuario o Contraseña incorrecta", "E8271A", "C22115");

    } else {

        usuario.push({ name: name.value, contraseña: contraseña.value });

        localStorage.setItem('usuario', JSON.stringify(usuario));

        //$("#modalLogin").modal('hide');


    }


});