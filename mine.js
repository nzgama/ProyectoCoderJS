let arrayHisorial = [];
let arrayHisorialBanco = [];

let saldoBanco = Number(7000);

const servicios = [
    {servicio: 'Luz', monto: 6000},
    {servicio: 'Gas', monto: 7000},
    {servicio: 'Internet', monto: 8000},
];

const banco = (operacion,saldo) =>{

    let saldoDisponible = document.querySelector("#banco-modal");

    if (operacion == "Deposito") {
        saldoBanco = saldoBanco + Number(saldo);
        saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
        toast("Operacion Exitosa","00b09b","96c93d");
        arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});
        actualizarValores("banco");

    } else {

        if ((saldoBanco - Number(saldo)) < 0) {

            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
            toast("Saldo insuficiente","E8271A","C22115");
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});

        }else{

            saldoBanco = saldoBanco - saldo;
            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
            toast("Operacion Exitosa","00b09b","96c93d");
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});
            actualizarValores("banco");
        }        
    }
}


const pagar = (servicioName,pago) =>{

    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = results.length > 0 ? results[0] : null;

    let deudaModal = document.querySelector("#deuda-modal");
    let pagoModal = document.querySelector("#pago-modal");

    if ((saldoBanco - pago) < 0) {

        deudaModal.textContent = `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("Saldo insuficiente","E8271A","C22115");
        arrayHisorial.push({servicio: servicioName, monto: 0, fecha:'hoy', pago:'fallido'});

    }else if(result.monto <= 0){

        deudaModal.textContent = Math.sign(result.monto) == -1 ? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("No registra deuda","1F27C2","2630F4");

    } else {

        saldoBanco = saldoBanco - pago;
        result.monto = result.monto - pago;
        deudaModal.textContent = Math.sign(result.monto) == -1 ? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("Operacion Exitosa","00b09b","96c93d");
        pagoModal.value = Math.sign(result.monto) == -1 ? 0 : result.monto;
        arrayHisorial.push({servicio: servicioName, monto: pago, fecha:'hoy', pago:'ok'});
        actualizarValores(servicioName);
    }
}

const actualizarValores = (servicioName,servicioName2) =>{

    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = (results.length > 0) ? results[0] : null;

    servicioName2 ?  boxServicio = servicioName2 : boxServicio = servicioName;
    
        if (boxServicio != "banco") {
            let svci =  document.getElementById(boxServicio);
            let servicioActualizar = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
            let servicioActualizarName = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            let servicioActualizarBtn = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild;

            servicioActualizar.textContent = (Math.sign(result.monto) == -1)? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto}`;
            servicioActualizarName.textContent = `Resumen de la cuenta de ${result.servicio}.`;
            servicioActualizarBtn.name = `${result.servicio}`;
            svci.id = `${result.servicio}`;
        }

        let banco =  document.getElementById('banco');
        let bancoActualizar = banco.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
        bancoActualizar.textContent = `Saldo disponible $ ${saldoBanco}`;
}

const historial = (servicio) =>{

    let divH = document.getElementById("historial-modal");
    let registros = divH.children;

    registros.length > 0 && (divH.innerHTML = '');

    arrayHisorial.forEach(element => {

        if (servicio == element.servicio) {

            let contenedor = document.createElement("p")
            contenedor.innerHTML = `pago de ${element.servicio} por ${element.monto} el dia de ${element.fecha} el pago fue ${element.pago}`
            divH.appendChild(contenedor);
          }
     });

    $("#modalHistorial").modal();
}

const editarServicio = (servicioName) =>{

    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = results.length > 0 ? results[0] : null;
    let oldName = result.servicio;
    let newName = document.getElementById("edit-nombre").value;
    let newDeuda = document.getElementById("edit-saldo").value;
    
    result.monto = newDeuda;
    result.servicio = newName;

    toast("Servicio Editado","00b09b","96c93d");
    $('#cerrar-edit').click();
    actualizarValores(newName,oldName);
}


let divServicios = document.getElementById("servicios");
servicios.forEach(servicio => {
    let contenedor = document.createElement("div");
    contenedor.classList.add('col-4');
    contenedor.style = "margin-bottom: 1vw;";
    contenedor.innerHTML = 
    `<div id="${servicio.servicio}" class="album py-5 bg-light border border-primary">
        <div class="container-fluid">
            <div class="row row-cols-12 row-cols-sm-12 row-cols-md-12 g-12">
                <div class="col animacion">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <p class="card-text">Resumen de la cuenta de ${servicio.servicio}.</p>
                            <small class="text-muted">Total a pagar $ ${servicio.monto}</small>
                            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group" role="group" aria-label="First group">
                                    <button id="btn_${servicio.servicio}" name="${servicio.servicio}" type="button" class="btn btn-info btn-outline-secondary btn-servicio"> Pagar </button>                                    
                                    <button id="btn_${servicio.servicio}_historial" name="${servicio.servicio}" type="button" class="btn btn-sm btn-outline-secondary btn-historial"> Historal de pagos </button>
                                </div>
                                <div class="input-group">
                                    <button name="${servicio.servicio}" type="button" class="btn btn-info btn-edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
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
});


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
                        <p class="card-text">Resumen de la cuenta bancaria.</p>
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

let btnDeposito = document.getElementById("btn_deposito");
let btnExtraccion = document.getElementById("btn_extraccion");
let tiuloModalPagos = document.querySelector("#modal-title-pago");
let deudaModalPagos = document.querySelector("#deuda-modal");
let pagoModalPagos = document.querySelector("#pago-modal");
let tiuloModalBanco = document.querySelector("#modal-title-banco");
let bancoModal = document.querySelector("#banco-modal");
let bancoSaldo = document.querySelector("#banco-saldo");
let tiuloModalEdit = document.querySelector("#modal-title-edit");
let editName = document.querySelector("#edit-nombre");
let editSaldo = document.querySelector("#edit-saldo");
let btnPagar = document.getElementById("pagar");
let btnedit = document.getElementById("edit");
let btnBanco = document.getElementById("banco-btn");

btnPagar.onclick = () =>{
    let pago = document.querySelector("#pago-modal").value;
    pagar(btnPagar.value,pago);
}

btnDeposito.onclick = () =>{
    tiuloModalBanco.textContent =`Banco Desposito`
    bancoModal.textContent =`Saldo disponible: ${saldoBanco}`
    bancoSaldo.value = 0;
    btnBanco.value = "Deposito"    
    btnBanco.textContent = "Depositar"    
    $("#modalBanco").modal();
}

btnExtraccion.onclick = () =>{
    tiuloModalBanco.textContent =`Banco Extraccion`
    bancoModal.textContent =`Saldo disponible: ${saldoBanco} ( su extraccion puede ser parcial )`
    bancoSaldo.value = 0;
    btnBanco.value = "Extraccion"    
    btnBanco.textContent = "Extraer"    
    $("#modalBanco").modal();
}

btnBanco.onclick = () =>{
    let saldo = document.querySelector("#banco-saldo").value;
    banco(btnBanco.value,saldo);
}

const toast = (mensaje,color1,color2)=>{
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
}

$('.btn-servicio').on('click', function(e) {
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
    let servicioName = `${$(this).attr('name')}`;
    historial(servicioName);
});


$('.btn-edit').on('click', function(e) {
    let servicioName = `${$(this).attr('name')}`;
    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = (results.length > 0) ? results[0] : null;
    btnedit.name = servicioName;
    tiuloModalEdit.textContent = `Editar el servicio ${servicioName}`;
    editName.value = result.servicio;
    editSaldo.value = result.monto;
    $("#modalEdit").modal();
});

$('#edit').on('click', function(e) {
    let servicioName = `${$(this).attr('name')}`;
    editarServicio(servicioName)
});


