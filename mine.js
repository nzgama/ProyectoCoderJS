
//const opciones = ['a','b','c','d','e','A','B','C','D','E'];

//const opcionesServicios = ['a','b','c','A','B','C'];

let arrayHisorial = [];

let arrayHisorialBanco = [];

let saldoBanco = Number(7000);
let deudaLuz = Number(6000);
let deudaGas = Number(7000);
let deudaInt = Number(8000);

const servicios = [
    {servicio: 'Luz', monto: deudaLuz},
    {servicio: 'Gas', monto: deudaGas},
    {servicio: 'Internet', monto: deudaInt}
];


// let accion = prompt(`Seleccione la opciones que desea realiza.
// Opciones:
//     A) Pagar la Luz
//     B) Pagar el gas
//     C) Pagar internet
//     D) Consultar Mis fondos
//     E) Historial de pagos (consola)`);

// const getAccion = () =>{

//     while (!opciones.includes(accion)) {
//     accion = prompt(`Seleccione la opciones que desea realizar.
//     Opciones:
//         A) Pagar la Luz
//         B) Pagar el gas
//         C) Pagar internet
//         D) Consultar Mis fondos 
//         E) Historial de pagos (consola)`);
//     }   

//     switch (accion) {
//         case 'a'||'A':
//             pagar(deudaLuz,'Luz');
//             accion = '';
//             break;

//         case 'b'||'B':
//             pagar(deudaGas,'Gas');
//             accion = '';
//             break;

//         case 'c'||'C':
//             pagar(deudaInt,'Internet');
//             accion = '';
//             break;

//         case 'd'||'D':
//             consultarSaldo();
//             accion = '';
//             break;

//         case 'e'||'E':
//             historial(); 
//             accion = '';
//             break;

//         default:
//             window.location.reload(); 
//             accion = '';
//             break;
//     }
// }

// const pagar = (deuda,servicio) =>{

//     accion = '';

//     if (deuda > 0) {
//         let accionServicio = prompt(`Su deuda de ${servicio} actual es de ${deuda}.
//         Opciones:
//             A) Pago total
//             B) Pago parcial
//             C) Volver al inicio`);

//         while (!opcionesServicios.includes(accionServicio)) {
//             accionServicio = prompt(`No es una opcion valida, Selecciona una valida.
//             Opciones:
//                 A) Pago total
//                 B) Pago parcial
//                 C) Volver al inicio`);
//         } 

//         switch (accionServicio) {
//             case 'a'||'A':
//                 accionServicio = '';
//                 pagoTotal(deuda,servicio);
//                 break;

//             case 'b'||'B':
//                 accionServicio = '';
//                 let montoParcial = Number(prompt(`Su deuda actual es de ${deuda} ingrese el monto a pagar`));
//                 pagoParcial(montoParcial,servicio);
//                 break;

//             case 'c'||'C':
//                 accionServicio = '';
//                 getAccion();
//                 break;

//             default:
//                 window.location.reload(); 
//                 break;
//         }

//     } else {
//         alert(`No registra deudas de ${servicio}`)
//         accionServicio = '';
//         getAccion();
//     }
// }

// const consultarSaldo = () =>{

//     if (confirm(`Su saldo actual es de ${saldoBanco}, desea ingresar mas dinero ?`) == true) {
//         saldoBanco += Number(prompt(`Ingrese el monto a depositar`));
//         alert(`Saldo actual: ${saldoBanco} `);
//         accion = '';
//         getAccion();
//     } else {
//         accion = '';
//         getAccion();
//     }

// }

// const pagoTotal = (saldo,servicio) =>{


//     let padre =  document.getElementById(`${servicio}`);
//     let hijo = padre.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;

//     if ((saldoBanco - saldo) < 0) {
//         alert(`Saldo inuficiente le faltan ${saldo - saldoBanco } para ralizar la accion`);
//         arrayHisorial.push({servicio: 'luz', monto: 0, fecha:'hoy', pago:'fallido'});
//         //getAccion();
//     } else {

//         saldoBanco = saldoBanco - saldo;
//         if (servicio =='Luz') {
//             deudaLuz = 0;
//             hijo.textContent = `Total a pagar $ ${deudaLuz}`
//         } else if(servicio =='Gas') {
//             deudaGas = 0;
//             hijo.textContent = `Total a pagar $ ${deudaGas}`
//         }else{
//             deudaInt = 0;
//             hijo.textContent = `Total a pagar $ ${deudaInt}`
//         }

//         alert(`operacion exitosa fondos actuales ${saldoBanco}`);
//         arrayHisorial.push({servicio: servicio, monto: saldo, fecha:'hoy', pago:'total'});
//         //getAccion();
//     }

// }
const banco = (operacion,saldo) =>{

    let saldoDisponible = document.querySelector("#banco-modal");

    if (operacion == "Deposito") {

        saldoBanco = saldoBanco + Number(saldo);
        saldoDisponible.textContent =`Saldo disponible: ${saldoBanco} ( Operacion exitosa )`;
        arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});
        actualizarValores("banco",0);

    } else {

        if ((saldoBanco - Number(saldo)) < 0) {

            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco} ( Saldo insuficiente )`;
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});

        }else{

            saldoBanco = saldoBanco - saldo;
            saldoDisponible.textContent =`Saldo disponible: ${saldoBanco} ( Operacion exitosa )`;
            arrayHisorialBanco.push({operacion: operacion, monto: saldo, fecha:'hoy', estado:'ok'});
            actualizarValores("banco",0);
        }        
    }
}


const pagar = (servicio,pago) =>{

    let deudaModal = document.querySelector("#deuda-modal");
    let pagoModal = document.querySelector("#pago-modal");
    let deuda = 0;

    if (servicio =='Luz') {

        deuda = deudaLuz;

    } else if(servicio =='Gas') {

        deuda = deudaGas;

    }else{

        deuda = deudaInt;
    }

    if ((saldoBanco - pago) < 0) {

        deudaModal.textContent =`Total a pagar: ${deuda} ( Saldo insuficiente )`;
        arrayHisorial.push({servicio: servicio, monto: 0, fecha:'hoy', pago:'fallido'});

    }else if(deuda == 0){

        deudaModal.textContent =`Total a pagar: ${deuda} ( No registra deuda )`;

    } else {

        saldoBanco = saldoBanco - pago;
       
         if (servicio =='Luz') {

            deudaLuz = deudaLuz - pago;
            deuda = deudaLuz;

         } else if(servicio =='Gas') {

            deudaGas = deudaGas - pago;
            deuda = deudaGas;

         }else{

            deudaInt = deudaInt - pago;
            deuda = deudaInt;
         }

        deudaModal.textContent =`Total a pagar: ${deuda} ( Operacion exitosa )`
        pagoModal.value = deuda;

        arrayHisorial.push({servicio: servicio, monto: pago, fecha:'hoy', pago:'ok'});

        actualizarValores(servicio,deuda);
    }
}

const actualizarValores = (servicio,deuda) =>{

        if (servicio != "banco") {
            let svci =  document.getElementById(`${servicio}`);
            let servicioActualizar = svci.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
            //console.log(padre.children[1]);
            servicioActualizar.textContent = `Total a pagar $ ${deuda}`
        }

        let banco =  document.getElementById(`banco`);
        let bancoActualizar = banco.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
        bancoActualizar.textContent = `Saldo disponible $ ${saldoBanco}`
}

const historial = (servicio) =>{
    let divH = document.getElementById("historial-modal")
    arrayHisorial.forEach(element => {

        if (servicio == element.servicio) {
            let contenedor = document.createElement("p")
            //console.log(`pago de ${element.servicio} por ${element.monto} el dia de ${element.fecha} el pago fue ${element.pago} `);
            contenedor.innerHTML = `pago de ${element.servicio} por ${element.monto} el dia de ${element.fecha} el pago fue ${element.pago}`
            divH.appendChild(contenedor);
          }
     });

    $("#modalHistorial").modal();
}

let divServicios = document.getElementById("servicios")
servicios.forEach(servicio => {
    let contenedor = document.createElement("div")
    contenedor.classList.add('col');
    contenedor.innerHTML = 
    `<div id="${servicio.servicio}" class="album py-5 bg-light">
        <div class="container-fluid">
            <div class="row row-cols-12 row-cols-sm-12 row-cols-md-12 g-12">
                <div class="col animacion">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <p class="card-text">Resumen de la cuenta de ${servicio.servicio}.</p>
                            <small class="text-muted">Total a pagar $ ${servicio.monto}</small>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button id="btn_${servicio.servicio}" type="button" class="btn btn-info btn-outline-secondary">
                                        Pagar 
                                    </button>
                                    <button id="btn_${servicio.servicio}_historial" type="button" class="btn btn-sm btn-outline-secondary"> 
                                        Historal de pagos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    divServicios.appendChild(contenedor);
});


let divBanco = document.getElementById("banco")
let contenedor = document.createElement("div")
contenedor.classList.add('col');
contenedor.innerHTML = 
`<div class="album py-5 bg-light">
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
</div>`
divBanco.appendChild(contenedor);

let btnLuz = document.getElementById("btn_Luz");
let btnGas = document.getElementById("btn_Gas");
let btnInt = document.getElementById("btn_Internet");

let btnLuzH = document.getElementById("btn_Luz_historial");
let btnGasH = document.getElementById("btn_Gas_historial");
let btnIntH = document.getElementById("btn_Internet_historial");

let btnDeposito = document.getElementById("btn_deposito");
let btnExtraccion = document.getElementById("btn_extraccion");

let tiuloModalPagos = document.querySelector("#modal-title-pago");
let deudaModalPagos = document.querySelector("#deuda-modal");
let pagoModalPagos = document.querySelector("#pago-modal");

let tiuloModalBanco = document.querySelector("#modal-title-banco");
let bancoModal = document.querySelector("#banco-modal");
let bancoSaldo = document.querySelector("#banco-saldo");

let btnPagar = document.getElementById("pagar");

let btnBanco = document.getElementById("banco-btn");


btnLuz.onclick = () =>{
    tiuloModalPagos.textContent =`Pagar Luz`
    deudaModalPagos.textContent =`Total a pagar: ${deudaLuz} ( su pago puede ser parcial )`
    pagoModalPagos.value = deudaLuz;
    btnPagar.value = "Luz"
    $("#modalPagos").modal();
}

btnGas.onclick = () =>{
    tiuloModalPagos.textContent =`Pagar Gas`
    deudaModalPagos.textContent =`Total a pagar: ${deudaGas} ( su pago puede ser parcial )`
    pagoModalPagos.value = deudaGas;
    btnPagar.value = "Gas"
    $("#modalPagos").modal();
}

btnInt.onclick = () =>{    
    tiuloModalPagos.textContent =`Pagar Internet`
    deudaModalPagos.textContent =`Total a pagar: ${deudaInt} ( su pago puede ser parcial )`
    pagoModalPagos.value = deudaInt;
    btnPagar.value = "Internet"
    $("#modalPagos").modal();
}

btnLuzH.onclick = () =>{
    historial("Luz");
}

btnGasH.onclick = () =>{
    historial("Gas");
}

btnIntH.onclick = () =>{
    historial("Internet");
}

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

