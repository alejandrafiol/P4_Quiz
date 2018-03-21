//Objeto creado para acceder a la BBDD. Cargo modulo 'sequelize'. Sequelize es el constructor.
const Sequelize = require ('sequelize');

//Genero instancia Sequelize para acceder a la BBDD que está localizada en el fichero quizzes.sqlite. sqlite es el protocolo
//para acceder a la BBDD. El conjunto "sqlite:quizzes.sqlite" es la URL para acceder a la BBDD.
//{logging: false} es una opción para que no me salgan trazas en el objeto sequelize al arrancar el programa.
const sequelize = new Sequelize ("sqlite:quizzes.sqlite", {logging: false});

//Definimos el modelo de datos 'quiz'.
sequelize.define('quiz', {
    question: {
        type: Sequelize.STRING,
        unique: {msg: "Ya existe esta pregunta"}, //Condición de no repetir.
        validate: {notEmpty: {msg: "La pregunta no puede estar vacía"}} //Condición de no preguntas vacias.
    },
    answer: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "La respuesta no puede estar vacía"}}
    }

});

//Miramos si en la BBDD existen las tablas que necesito, sino las creamos.
//La sincronización es una promesa.
sequelize.sync()
.then(() => sequelize.models.quiz.count()) //Cuando acaba la sync, se ejecuta el 1ª then, que también es una promesa.
//De los modelos definidos, models, cojo el modelo quiz y cuento los que hay. Cuando tenga el valor, paso al 2ª then.
.then(count => { //Toma como parámetro el valor.
    if (!count) { //Si el valor es 0, creo varios quizzes, bulkCreate, en forma de promesa.
        //Pongo return para que la promesa del 2ªthen espere a que la promesa del bulkCreate termine.
        return sequelize.models.quiz.bulkCreate([
            { question: "Capital de Italia", answer: "Roma" },
            { question: "Capital de Francia", answer: "París" },
            { question: "Capital de España", answer: "Madrid" },
            { question: "Capital de Portugal", answer: "Lisboa" }
        ])
    }
})
.catch(error => {
    console.log(error);
});

//Exporto mi modelo de datos. Con éste creamos nuevos quizzes, los buscamos, los borramos.
//A partir de sequelize.models.quiz. llamaré a la función que quiera.
module.exports = sequelize;