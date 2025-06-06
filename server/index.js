const express = require("express")
const app = express()
const mysql = require('mysql2');
const cors = require("cors");
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json())

const db= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'empleados_crud'
})
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL!');
});



app.post('/create', (req, res) => {
  const { nombre, edad, pais, cargo, anios } = req.body;

  if (!nombre || !edad || !pais || !cargo || !anios) {
    return res.status(400).send({ error: "Faltan datos obligatorios" });
  }

  db.query(
    'INSERT INTO empleados(nombre, edad, pais, cargo, anios) VALUES (?, ?, ?, ?, ?)',
    [nombre, edad, pais, cargo, anios],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: "Error al registrar el empleado" });
      }
      res.send({ message: "Empleado registrado con éxito", id: result.insertId });
    }
  );
});


app.get('/empleados',(req, res)=>{
   
    db.query('SELECT * FROM empleados',
        (err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        }
    )
})

app.put('/update',(req, res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad= req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    db.query('UPDATE empleados SET nombre=?,edad=?,pais=?,cargo=?,anios=? WHERE id=?',[nombre,edad,pais,cargo,anios,id],
        (err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        }
    )
})

app.delete('/delete/:id',(req, res)=>{
    const id = req.params.id;
 

    db.query('DELETE FROM empleados WHERE id=?',id,
        (err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        }
    )
})


app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`)
})

module.exports = db;

