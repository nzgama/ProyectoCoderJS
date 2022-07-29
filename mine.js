const date = luxon.DateTime.now();

let arrayHisorial = localStorage.arrayHisorial ? JSON.parse(localStorage.getItem('arrayHisorial')) : [];
let arrayHisorialBanco = localStorage.arrayHisorialBanco ? JSON.parse(localStorage.getItem('arrayHisorialBanco')) : [];
let saldoBanco = localStorage.saldoBanco ? localStorage.getItem('saldoBanco') : Number(7000);

const obtenerServicios = async() => { 
    if (localStorage.servicios == undefined || localStorage.servicios == '[]') {
        await fetch('/data.json')
        .then((response)=> response.json())
        .then((data)=> {
            let servicios = data;
            localStorage.setItem('servicios',JSON.stringify(servicios));
            servicioDiv();
            bancoDiv();
        });
    }else{
        servicioDiv();
        bancoDiv();
    }
};

const banco = (operacion,saldo) =>{

    let saldoDisponible = document.querySelector("#banco-modal");

    if (operacion == "Deposito") {
        saldoBanco = saldoBanco + Number(saldo);
        saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
        toast("Operacion Exitosa","00b09b","96c93d");
        arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:date.toLocaleString(), estado:'ok'});
        actualizarValores("banco");

    } else {

        if ((saldoBanco - Number(saldo)) < 0) {
            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
            toast("Saldo insuficiente","E8271A","C22115");
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:date.toLocaleString(), estado:'ok'});
        }else{
            saldoBanco = saldoBanco - saldo;
            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco}`;
            toast("Operacion Exitosa","00b09b","96c93d");
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:date.toLocaleString(), estado:'ok'});
            actualizarValores("banco");
        }        
    }
    localStorage.setItem('saldoBanco',saldoBanco);
    localStorage.setItem('arrayHisorialBanco',JSON.stringify(arrayHisorialBanco));
}


const pagar = (servicioName,pago) =>{



    let servicios = JSON.parse(localStorage.getItem('servicios'));
    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = results.length > 0 ? results[0] : null;
    let deudaModal = document.querySelector("#deuda-modal");
    let pagoModal = document.querySelector("#pago-modal");

    if ((saldoBanco - pago) < 0) {
        deudaModal.textContent = `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("Saldo insuficiente","E8271A","C22115");
        arrayHisorial.push({servicio: servicioName, monto: 0, fecha:date.toLocaleString(), pago:'fallido'});
        localStorage.setItem('arrayHisorial',JSON.stringify(arrayHisorial));
    }else if(result.monto <= 0){
        deudaModal.textContent = Math.sign(result.monto) == -1 ? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("No registra deuda","1F27C2","2630F4");
    } else {
        saldoBanco = saldoBanco - pago;
        result.monto = result.monto - pago;
        deudaModal.textContent = Math.sign(result.monto) == -1 ? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto} ( su pago puede ser parcial )`;
        toast("Operacion Exitosa","00b09b","96c93d");
        pagoModal.value = Math.sign(result.monto) == -1 ? 0 : result.monto;
        arrayHisorial.push({servicio: servicioName, monto: pago, fecha:date.toLocaleString(), pago:'ok'});
        localStorage.setItem('arrayHisorial',JSON.stringify(arrayHisorial));
        localStorage.setItem('servicios',JSON.stringify(servicios));
        actualizarValores(servicioName);
    }
}

const actualizarValores = (servicioName,servicioName2) =>{

    let servicios = JSON.parse(localStorage.getItem('servicios'));
    let results = servicios.filter(function (servicio) { return servicio.servicio == servicioName });
    let result = (results.length > 0) ? results[0] : null;

    servicioName2 ?  boxServicio = servicioName2 : boxServicio = servicioName;
    
        if (boxServicio != "banco") {
            let svci =  document.getElementById(boxServicio);
            let servicioActualizar = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
            let servicioActualizarName = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            let servicioActualizarBtn = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild;
            servicioActualizar.textContent = (Math.sign(result.monto) == -1)? `Saldo a favor: ${result.monto * -1}` : `Total a pagar: ${result.monto}`;
            servicioActualizarName.textContent = `Mi deuda ${result.servicio}.`;
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
    let servicios = JSON.parse(localStorage.getItem('servicios'));
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const url = 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=200';

const obtenerPokem = async () => {
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let pokemonName = data.results;
            let PalabraSeguridad = document.getElementById('palabra-seguridad');
            PalabraSeguridad.innerText = `${pokemonName[getRandomInt(pokemonName.length - 1 )].name}`;
       
        });
    
};

const servicioDiv = ()=>{
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

    let tiuloModalPagos = document.querySelector("#modal-title-pago");
    let deudaModalPagos = document.querySelector("#deuda-modal");
    let pagoModalPagos = document.querySelector("#pago-modal");

    let tiuloModalEdit = document.querySelector("#modal-title-edit");
    let editName = document.querySelector("#edit-nombre");
    let editSaldo = document.querySelector("#edit-saldo");
    let btnPagar = document.getElementById("pagar");
    let btnedit = document.getElementById("edit");
    let btndelet = document.getElementById("deleted");


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
        historial(servicioName);
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

    btnPagar.onclick = () =>{
        let pago = document.querySelector("#pago-modal").value;
        pagar(btnPagar.value,pago);
    }
}

const bancoDiv = ()=>{

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

$('#btn_deposito').on('click', function(e) {
    tiuloModalBanco.textContent =`Banco Desposito`
    bancoModal.textContent =`Saldo disponible: ${saldoBanco}`
    bancoSaldo.value = 0;
    btnBanco.value = "Deposito"    
    btnBanco.textContent = "Depositar"    
    $("#modalBanco").modal();
});

$('#btn_extraccion').on('click', function(e) {
    tiuloModalBanco.textContent =`Banco Extraccion`
    bancoModal.textContent =`Saldo disponible: ${saldoBanco} ( su extraccion puede ser parcial )`
    bancoSaldo.value = 0;
    btnBanco.value = "Extraccion"    
    btnBanco.textContent = "Extraer"    
    $("#modalBanco").modal();
});

$('#banco-btn').on('click', function(e) {
    let saldo = document.querySelector("#banco-saldo").value;
    banco(btnBanco.value,saldo);
});


}


// btnDeposito.onclick = () =>{
//     tiuloModalBanco.textContent =`Banco Desposito`
//     bancoModal.textContent =`Saldo disponible: ${saldoBanco}`
//     bancoSaldo.value = 0;
//     btnBanco.value = "Deposito"    
//     btnBanco.textContent = "Depositar"    
//     $("#modalBanco").modal();
// }

// btnExtraccion.onclick = () =>{
//     tiuloModalBanco.textContent =`Banco Extraccion`
//     bancoModal.textContent =`Saldo disponible: ${saldoBanco} ( su extraccion puede ser parcial )`
//     bancoSaldo.value = 0;
//     btnBanco.value = "Extraccion"    
//     btnBanco.textContent = "Extraer"    
//     $("#modalBanco").modal();
// }

// btnBanco.onclick = () =>{
//     let saldo = document.querySelector("#banco-saldo").value;
//     banco(btnBanco.value,saldo);
// }

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

//let btnDeposito = document.getElementById("btn_deposito");
//let btnExtraccion = document.getElementById("btn_extraccion");

$('#edit').on('click', function(e) {
    let servicioName = `${$(this).attr('name')}`;
    editarServicio(servicioName)
});

$('#servicios-p').on('click', function(e) {
     $("#modalAdd").modal();
});

$('#add').on('click', function(e) {
    let nombre = $("#add-nombre").val();
    let saldo = Number($("#add-saldo").val());

    nombre == '' && toast("Debe ingresar un nombre","E8271A","C22115");
    saldo == '' && toast("Debe ingresar un saldo","E8271A","C22115");
    saldo < 0 && toast("El saldo no puede ser negativo","E8271A","C22115");

    if (!(nombre == '') && !(saldo < 0 ||saldo=='' )) {

    toast("Operacion Exitosa","00b09b","96c93d");
    let servicios = JSON.parse(localStorage.getItem('servicios'));
    servicios.push({servicio: nombre, monto: saldo});
    localStorage.setItem('servicios',JSON.stringify(servicios));
    servicioDiv();
    $('#cerrar-add').click();

    }
});

$('#deleted').on('click', function(e) {

    let palabra = document.getElementById('palabra-seguridad').textContent;
    let palabra2 = $('#palabra-seguridad-confirm').val();

    if (palabra == palabra2) {
    
        let servicioName = `${$(this).attr('name')}`;
        let servicios = JSON.parse(localStorage.getItem('servicios'));
        localStorage.removeItem('servicios')
        servicios = servicios.filter((servicio) => servicio.servicio !== servicioName);
        localStorage.setItem('servicios',JSON.stringify(servicios));
        toast("Operacion Exitosa","00b09b","96c93d");
        $(`#${servicioName}`)[0].remove();
        $('#cerrar-deleted').click();
        servicioDiv();
     }else{
        toast("Palabra Incorrecta","E8271A","C22115");

     }
});

obtenerServicios();
