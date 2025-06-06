import './App.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2'


function App() {
  const [nombre, setNombre] = useState("")
  const [edad, setEdad] = useState("")
  const [pais, setPais] = useState("")
  const [cargo, setCargo] = useState("")
  const [anios, setAnios] = useState("")
  const [editar, setEditar] = useState(false)
  const [empleadosList, setEmpleadosList] = useState([])
  const [id, setId] = useState(0)
  

const add = () => {
  if (!nombre || !edad || !pais || !cargo || !anios) {
  Swal.fire({
    title: "Campos incompletos",
    text: "Por favor, completa todos los campos.",
    icon: "warning",
  });
  return;
  }
  axios.post("http://localhost:8000/create", {
    nombre,
    edad,
    pais,
    cargo,
    anios
  }).then(() => {
    getEmpleados();
    limpiarCampos();
    Swal.fire({
      title: "Registro exitoso",
      html: `El empleado <strong> ${nombre}</strong> fue registrado con exito`,
      icon: 'success',
      timer: 5000,
    });
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title:JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde": JSON.parse(JSON.stringify(error)) 
    });
  });
};

const update = () => {
  axios.put("http://localhost:8000/update", {
    id,
    nombre,
    edad,
    pais,
    cargo,
    anios
  }).then(() => {
    getEmpleados();
    limpiarCampos();
     Swal.fire({
      title: "Actualización exitosa",
      html: `El empleado <strong> ${nombre}</strong> fue actualizado con exito`,
      icon: 'success',
      timer: 5000,
    });
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde": JSON.parse(JSON.stringify(error))
    
    });
  });
};

const deleteEmple = (val) => {

 Swal.fire({
      title: `Eliminar Registro`,
      html: `Estas seguro de eliminar a <strong>${val.nombre}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
     }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:8000/delete/${val.id}`).then(() => {
           getEmpleados();
           limpiarCampos();
           Swal.fire({
              title: "Eliminado!",
              html: `<strong> ${val.nombre}</strong> fue eliminado con exito`,
              icon: "success",
              timer:5000,
           });
           }).catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al eliminar empleado!",
              footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde": JSON.parse(JSON.stringify(error))
            });
           });
          
       }
      });
};

const limpiarCampos = () => {
   setNombre("");
   setEdad("");
   setPais("");
   setCargo("");
   setAnios("");
   setId("");
   setEditar(false)
}

const editarEmpleado = (val)=> {
  setEditar(true)


  setNombre(val.nombre);
  setEdad(val.edad);
  setPais(val.pais);
  setCargo(val.cargo);
  setAnios(val.anios);
  setId(val.id);
  
}

const getEmpleados = () => {
  axios.get("http://localhost:8000/empleados")
    .then((response) => {
      setEmpleadosList(response.data);
    })
    .catch((error) => {
      console.error('Error al obtener empleados:', error);
    });
};

  useEffect(() => {
  getEmpleados();
}, []);
  
  return (

    <div className="container"> 
  
      <div className="card text-center">
            <div className="card-header">
              Gestion de empleados
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Nombre:</span>
                <input type="text" value={nombre} className="form-control" placeholder="Ingrese un Nombre" aria-label="Nombre" aria-describedby="basic-addon1" onChange={(event)=>{
                    setNombre(event.target.value)
                  }}/>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Edad:</span>
                <input type="number" value={edad} className="form-control" placeholder="Ingrese una Edad" aria-label="Edad" aria-describedby="basic-addon1" onChange={(event)=>{
                  setEdad(event.target.value)
                }}/>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Pais:</span>
                <input type="text" value={pais} className="form-control" placeholder="Ingrese un Pais" aria-label="Pais" aria-describedby="basic-addon1" onChange={(event)=>{
                setPais(event.target.value)
                }}/>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Cargo:</span>
                <input type="text" value={cargo} className="form-control" placeholder="Ingrese un Cargo" aria-label="Cargo" aria-describedby="basic-addon1" onChange={(event)=>{
                  setCargo(event.target.value)
                  }}/>
              </div>
              <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Años:</span>
              <input type="number" value={anios} className="form-control" placeholder="Ingrese Antiguedad" aria-label="Años" aria-describedby="basic-addon1" onChange={(event)=>{
                  setAnios(event.target.value)
                  }}
                />
            </div>
            
          </div>
          <div className="card-footer text-body-secondary">
            {
              editar === true? 
              <div>
                <button className='btn btn-warning m-3' onClick={update}>Actualizar</button>  <button className='btn btn-info' onClick={limpiarCampos}>Cancelar</button></div>:
                <button className='btn btn-success' onClick={add}>Registrar</button>
            }
              
          </div>
      </div>
      <table className="table table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
           {empleadosList.map((val, key)=> (
                <tr key={val.id}>
                  <th scope="row">{val.id}</th>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.pais}</td>
                  <td>{val.cargo}</td>
                  <td>{val.anios}</td>
                  <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <button type="button" className="btn btn-info" onClick={()=>{
                            editarEmpleado(val)}}>Editar</button>
                          <button type="button" className="btn btn-danger" onClick={()=>{deleteEmple(val)}} >Eliminar</button>
                        </div>
                  </td>
                </tr>
              ))} 
        
        </tbody>
      </table>
    </div>
  );
}

export default App;
