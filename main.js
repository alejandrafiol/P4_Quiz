
const readline = require('readline');
const {log, biglog, errorlog, colorize} = require("./out");
const cmds = require("./cmds");
const net= require("net");

//Creamos el socket servidor.
//El socket que nos conecta con un cliente está aquí.
net.createServer(socket => {

    //Para detectar cuando se ha conectado un cliente, saldrá un mensaje diciendo desde la dirección donde se conecta.
    console.log("Se ha conectado un cliente desde" + socket.remoteAddress);

    //Mensaje inicial.
    biglog(socket, 'CORE Quiz', 'green');


    const rl = readline.createInterface({
        //Debemos leer y escribir desde el socket, no por la salida estandar.
        input: socket,
        output: socket,
        prompt: colorize("quiz> ", 'blue'),
        completer: (line) => {
            const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
            const hits = completions.filter((c) => c.startsWith(line));
            // show all completions if none found
            return [hits.length ? hits : completions, line];
        }
    });
    //Voy a atender a los eventos de los sockets.
    //Cuando el cliente cierre la conexión, se debe cerrar el readline.
    //Si hay error en la conexión, también hacemos esto.
    socket
    .on("end", () => {rl.close();})
    .on("error", () => {rl.close();});
    rl.prompt();


//Interprete de comandos.

    rl
        .on('line', (line) => {

            let args = line.split(" ");
            let cmd = args[0].toLowerCase().trim();

            switch (cmd) {
                case '':
                    rl.prompt();
                    break;
                //Los comandos también deben escribir por el socket.
                case 'h':
                case 'help':
                    cmds.helpCmd(socket, rl);
                    break;

                case 'q':
                case 'quit':
                    cmds.quitCmd(socket, rl);
                    break;

                case 'add':
                    cmds.addCmd(socket, rl);
                    break;

                case 'list':
                    cmds.listCmd(socket, rl);
                    break;

                case 'show':
                    cmds.showCmd(socket, rl, args[1]);
                    break;

                case 'test':
                    cmds.testCmd(socket, rl, args[1]);
                    break;

                case 'p':
                case 'play':
                    cmds.playCmd(socket, rl);
                    break;

                case 'delete':
                    cmds.deleteCmd(socket, rl, args[1]);
                    break;

                case 'edit':
                    cmds.editCmd(socket, rl, args[1]);
                    break;

                case 'credits':
                    cmds.creditsCmd(socket, rl);
                    break;


                default:
                    log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
                    log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles. `);
                    rl.prompt();
                    break;
            }

        })
        .on('close', () => {
            log(socket, 'Adios!');
            //No hay que matar el servidor con process.exit(0); 
            //Solamente cerraré el readline y el socket.
        });



})
.listen(3030);

