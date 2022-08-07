import { banco } from "./operaciones.js";

/********************************/
/* Funcion agregar banco al DOM */
/********************************/
export const bancoDiv = () => {
  let saldoBanco = localStorage.saldoBanco
    ? localStorage.getItem("saldoBanco")
    : Number(7000);
  let divBanco = document.getElementById("banco");
  let contenedor = document.createElement("div");
  contenedor.classList.add("col");
  contenedor.innerHTML = `<div class="album py-5 bg-light border border-primary">
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

  //elmentos del modal banco
  let tiuloModalBanco = document.querySelector("#modal-title-banco");
  let bancoModal = document.querySelector("#banco-modal");
  let bancoSaldo = document.querySelector("#banco-saldo");
  let btnBanco = document.getElementById("banco-btn");

  /*************************/
  /* depositar en el banco */
  /*************************/
  $("#btn_deposito").on("click", function (e) {
    let saldoBanco = localStorage.saldoBanco
      ? localStorage.getItem("saldoBanco")
      : Number(7000);
    tiuloModalBanco.textContent = `Banco Despositos`;
    bancoModal.textContent = `Saldo disponible: ${saldoBanco}`;
    bancoSaldo.value = 0;
    btnBanco.value = "Deposito";
    btnBanco.textContent = "Depositar";
    $("#modalBanco").modal();
  });

  /**************************/
  /* extraccion en el banco */
  /**************************/
  $("#btn_extraccion").on("click", function (e) {
    let saldoBanco = localStorage.saldoBanco
      ? localStorage.getItem("saldoBanco")
      : Number(7000);
    tiuloModalBanco.textContent = `Banco Extraccion`;
    bancoModal.textContent = `Saldo disponible: ${saldoBanco} ( su extraccion puede ser parcial )`;
    bancoSaldo.value = 0;
    btnBanco.value = "Extraccion";
    btnBanco.textContent = "Extraer";
    $("#modalBanco").modal();
  });

  /*************************/
  /* operacion en el banco */
  /*************************/
  $("#banco-btn").on("click", function (e) {
    //identificar extraccion o deposito
    let saldo = document.querySelector("#banco-saldo").value;
    //llmar funcion para registrar la operacion
    banco(btnBanco.value, saldo);
  });
};
