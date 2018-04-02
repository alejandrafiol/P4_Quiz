
const figlet = require('figlet');
const chalk = require('chalk');

//Debemos modificar este modulo, para que en vez de que los mensajes aparezcan en la consola,
// aparezcan por el socket de los clientes.

/**
 * Dar color a un string.
 *
 * @param msg Es el string al que hay que dar color.
 * @param color Color que vamos a usar para pintar el mensaje.
 * @returns {string} Devuelve el string con el color indicado.
 */

const colorize = (msg, color) => {
    if (typeof color !== "undefined") {
        msg = chalk[color].bold(msg);
    }
    return msg;
};


/**
 * Escribe mensaje de log.
 *
 * @param msg El string a escribir.
 * @param color Color del texto.
 */

const log = (socket, msg, color) => {
    //Como se meterá retorno de carro, añadimos el "\n"
    socket.write(colorize(msg, color) + "\n");
};


/**
 * Escribe mensaje de log grande.
 *
 * @param msg El string a escribir.
 * @param color Color del texto.
 */

const biglog = (socket, msg, color) => {
    log(socket, figlet.textSync(msg, { horizontalLayout: 'full' }), color);
};


/**
 * Escribe mensaje de error emsg.
 *
 * @param emsg Texto del mensaje de error.
 */

const errorlog = (socket, emsg) => {
    //También cambiamos el console.log por sockt.write y añadimos el retorno de carro.
    socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\n`);

};

// Objeto exportar. Definido para las funciones de este modulo.
exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};