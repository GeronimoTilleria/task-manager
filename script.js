
const FECHA_LIMITE = document.getElementById('fecha-limite');
const DESCRIPCION = document.getElementById('descripcion');
const AGREGAR = document.getElementById('agregar');
const TAREAS = document.getElementById('tareas');
const ERROR = document.getElementById('error');



const SHEET_ID = "1pGtv8U2P3AOv4Xrkmo_tPVDCzUxakuIl5FBfmy6dOas";

const ACCESS_TOKEN = "ya29.a0Aa4xrXN9gL-7r95PQTO8sCrFMRH-iwdHb-7QmffpYN2r1thkF5QOWUd5q3xWNwjQvpP2AOphLp3LkVbggRNi-GfIHWbgBFnAjpvaKpoJv0nE7zIEnn0ltsY4Qm8X7tO1HuHqSKa33MzKGGqizD-3rRLL52o2lAaCgYKAe4SARISFQEjDvL9Zf-yYmpRZwK2NqyD6XgzVg0165";

listaTareas();

function listaTareas() {

    fetch(
        //Obtenemos los datos de la planilla, de la hojaTareas, columnas A y B desde la segunda fila
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/tareas!A2:C`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            },
        }
    ).then(function (response) {
        //esperamos el json del response para poder utilizarlo
        response.json().then(function (data) {
            const values = data.values;

            //Obtenemos el elemento del dom

            for (let i = 0; i < values.length; i++) {
                //Div que va a contener los datos de la tarea
                const TAREA = document.createElement('div');
                TAREA.className = 'tarea';

                //Fecha de la tarea
                const FECHA = document.createElement('span');
                FECHA.innerHTML = values[i][0];

                //Descripcion de la tarea
                const TAREA_DESCRIPCION = document.createElement('p');
                TAREA_DESCRIPCION.innerHTML = values[i][1];

                //Boton eliminar
                const BOTON_ELIMINAR = document.createElement('button');
                BOTON_ELIMINAR.className = 'eliminar';
                BOTON_ELIMINAR.innerText = 'X';

                //Agregamos todos los elementos al div de producto
                TAREA.appendChild(FECHA);
                TAREA.appendChild(TAREA_DESCRIPCION);
                TAREA.appendChild(BOTON_ELIMINAR);

                //Agregamos la tarea a la lista
                TAREAS.appendChild(TAREA);

                BOTON_ELIMINAR.addEventListener('click', () => {

                });
            }
        })
    });
}

function onRegistrarTareas() {
    //Obtenemos los datos del formulario
    //Creamos el JSOn que espera nuestra API
    let data = {};
    let values = [];
    let fila = [FECHA_LIMITE.value, DESCRIPCION.value];

    values.push(fila);

    //Verificar que coincida con el nombre de la hoja de nuestro sheet
    data.range = "tareas";
    data.majorDimension = "ROWS";
    data.values = values;

    //Invocamos al método POST de la API
    fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/tareas:append?valueInputOption=USER_ENTERED`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(data)
        }
    ).then(function (response) {
        TAREAS.innerHTML = '';
        listaTareas();
        response.json().then(function (data) {

        });
    });

    //Limpiamos los campos del formulario para permitir cargar una nueva tarea
    FECHA_LIMITE.value = '';
    DESCRIPCION.value = '';

}

AGREGAR.addEventListener('click', () => {

    if (FECHA_LIMITE.value !== '' && DESCRIPCION.value !== '') {
        // Escribir la hoja
       
        onRegistrarTareas();
       
    } else {
        // Mensaje de error
        ERROR.style.display = 'block';
        setTimeout(() => {
            ERROR.style.display = 'none';
        }, 5000);
    }
});