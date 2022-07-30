import { historialServicios } from "./historalServicios.js";

import {obtenerPokem} from "../../app.js"

let tiuloModalPagos = document.querySelector("#modal-title-pago");
let deudaModalPagos = document.querySelector("#deuda-modal");
let pagoModalPagos = document.querySelector("#pago-modal");
let tiuloModalEdit = document.querySelector("#modal-title-edit");
let editName = document.querySelector("#edit-nombre");
let editSaldo = document.querySelector("#edit-saldo");
let btnedit = document.getElementById("edit");
let btndelet = document.getElementById("deleted");
let btnPagar = document.getElementById("pagar");

export const servicioDiv = () => {

    let divServicios = document.getElementById("servicios");
    let arr = JSON.parse(localStorage.getItem('servicios'));
    let contenedor = '';
    divServicios.innerHTML = contenedor;

    arr.forEach(servicio => {
        if ($(`#${servicio.servicio}`).val() == undefined) {
            contenedor = document.createElement("div");
            contenedor.classList.add('col-4');
            contenedor.style = "margin-bottom: 1vw;";
            contenedor.innerHTML = 
            `<div id="${servicio.servicio}" class="album py-5 bg-light border border-primary">
                <div class="container-fluid">
                    <div class="row row-cols-12 row-cols-sm-12 row-cols-md-12 g-12">
                        <div class="col animacion">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <p class="card-text">Mi deuda ${servicio.servicio}.</p>
                                    <small class="text-muted">Total a pagar $ ${servicio.monto}</small>
                                    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                        <div class="btn-group" role="group" aria-label="First group">
                                            <button id="btn_${servicio.servicio}" name="${servicio.servicio}" type="button" class="btn btn-info btn-outline-secondary btn-servicio"> Pagar </button>                                    
                                            <button id="btn_${servicio.servicio}_historial" name="${servicio.servicio}" type="button" class="btn btn-sm btn-outline-secondary btn-historial"> Historal de pagos </button>
                                        </div>
                                        <div class="input-group">
                                            <button name="${servicio.servicio}" style="margin: 2px;" type="button" class="btn btn-info btn-edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                                            </button>
                                            <button name="${servicio.servicio}" style="margin: 2px;" type="button" class="btn btn-danger btn-borrar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>                                       
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            divServicios.appendChild(contenedor);
        }
    });

    $('.btn-servicio').on('click', function(e) {
        e.preventDefault();
        let servicios = JSON.parse(localStorage.getItem('servicios'));
        let servicioName = `${$(this).attr('name')}`;
        let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
        let result = (results.length > 0) ? results[0] : null;
        tiuloModalPagos.textContent =`Pagar ${result.servicio}`;
        deudaModalPagos.textContent =`Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        pagoModalPagos.value = result.monto;
        btnPagar.value = `${$(this).attr('name')}`;
        $("#modalPagos").modal();
    });

    $('.btn-historial').on('click', function(e) {
        e.preventDefault();
        let servicioName = `${$(this).attr('name')}`;
        historialServicios(servicioName);
    });

    $('.btn-edit').on('click', function(e) {
        e.preventDefault();
        let servicios = JSON.parse(localStorage.getItem('servicios'));
        let servicioName = `${$(this).attr('name')}`;
        let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
        let result = (results.length > 0) ? results[0] : null;
        btnedit.name = servicioName;
        tiuloModalEdit.textContent = `Editar el servicio ${servicioName}`;
        editName.value = result.servicio;
        editSaldo.value = result.monto;
        $("#modalEdit").modal();
    });

    $('.btn-borrar').on('click', function(e) {
        e.preventDefault();
        let servicioName = `${$(this).attr('name')}`;
        btndelet.name = servicioName;
        obtenerPokem();
        $("#modalDelet").modal();

    });

}
