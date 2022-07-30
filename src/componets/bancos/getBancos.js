import {bancoDiv} from "../bancos/actualizarBancos.js"

export const getBancos = async() => { 
    if (localStorage.saldoBanco == undefined || localStorage.saldoBanco == '[]') {
        await fetch('../src/data/data.json')
        .then((response)=> response.json())
        .then((data)=> {
            let saldoBanco = data[1][0]['banco'];
            localStorage.setItem('saldoBanco',saldoBanco);
            bancoDiv();
        });
    }else{
        bancoDiv();
    }
};