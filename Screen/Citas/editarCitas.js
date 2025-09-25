import React from 'react';

const EditarCitas = () => {
    return (
        <div>
            <h2>Editar Cita</h2>
            {/* Aquí puedes agregar el formulario para editar la cita */}
            <form>
                <div>
                    <label>Fecha:</label>
                    <input type="date" name="fecha" />
                </div>
                <div>
                    <label>Hora:</label>
                    <input type="time" name="hora" />
                </div>
                <div>
                    <label>Paciente:</label>
                    <input type="text" name="paciente" />
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarCitas;