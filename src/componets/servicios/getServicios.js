import { servicioDiv } from "./atualizarServicios.js"

export const getServicios = async () => {
    if (localStorage.servicios == undefined || localStorage.servicios == '[]') {
        await fetch('../src/data/data.json')
            .then((response) => response.json())
            .then((data) => {
                let servicios = data[0];
                localStorage.setItem('servicios', JSON.stringify(servicios));
                servicioDiv();
            });
    } else {
        servicioDiv();
    }
};