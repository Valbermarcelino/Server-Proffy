import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();


//Corpo(Request Body): Dados para a criação de um registro
//Route Params: Identificar qual recurso eu quero atualizar ou deletar
//Query Params: Paginação, filtros, ordenação

//app.get('/users', (request, response) => {
    //return response.send('Hello World');
    /*console.log(request.body);
    
    const users = [
        { name: 'Diego', age: 25},
        { name: 'Valber', age: 20},
    ];

    return response.json(users);*/
    /*return response.json({message: "Hello World"});
});*/

//http://localhost:3333/users

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);

//SELECT * FROM users com knex fica : knex('users').select('*')