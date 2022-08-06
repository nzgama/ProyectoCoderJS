import { banco } from "./operaciones.js"

export const bancoDiv = () => {

    let saldoBanco = localStorage.saldoBanco ? localStorage.getItem('saldoBanco') : Number(7000);
    let divBanco = document.getElementById("banco");
    let contenedor = document.createElement("div");
    contenedor.classList.add('col');
    contenedor.innerHTML =
        `<div class="album py-5 bg-light border border-primary">
        <div class="container-fluid">
            <div class="row row-cols-12 row-cols-sm-12 row-cols-md-12 g-12">
                <div class="col animacion">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <p class="card-text">Cuenta bancaria.</p>
                            <small class="text-muted">Saldo disponible $ ${saldoBanco}</small>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button id="btn_deposito" type="button" class="btn btn-info btn-outline-secondary">
                                        Despositar Fondos 
                                    </button>
                                    <button id="btn_extraccion" type="button" class="btn btn-sm btn-outline-secondary"> 
                                        Extraer Fordos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    divBanco.appendChild(contenedor);


    let tiuloModalBanco = document.querySelector("#modal-title-banco");
    let bancoModal = document.querySelector("#banco-modal");
    let bancoSaldo = document.querySelector("#banco-saldo");
    let btnBanco = document.getElementById("banco-btn");

    $('#btn_deposito').on('click', function (e) {
        let saldoBanco = localStorage.saldoBanco ? localStorage.getItem('saldoBanco') : Number(7000);
        tiuloModalBanco.textContent = `Banco Desposito`
        bancoModal.textContent = `Saldo disponible: ${saldoBanco}`
        bancoSaldo.value = 0;
        btnBanco.value = "Deposito"
        btnBanco.textContent = "Depositar"
        $("#modalBanco").modal();
    });

    $('#btn_extraccion').on('click', function (e) {
        let saldoBanco = localStorage.saldoBanco ? localStorage.getItem('saldoBanco') : Number(7000);
        tiuloModalBanco.textContent = `Banco Extraccion`
        bancoModal.textContent = `Saldo disponible: ${saldoBanco} ( su extraccion puede ser parcial )`
        bancoSaldo.value = 0;
        btnBanco.value = "Extraccion"
        btnBanco.textContent = "Extraer"
        $("#modalBanco").modal();
    });

    $('#banco-btn').on('click', function (e) {
        let saldo = document.querySelector("#banco-saldo").value;
        banco(btnBanco.value, saldo);
    });
}