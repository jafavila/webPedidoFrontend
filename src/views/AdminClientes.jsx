import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import Swal from 'sweetalert2';

const AdminClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState({ idCliente: 0, nombre: '', correo: '', password: '', isAdmin: false });

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            const res = await api.get('/cliente');
            setClientes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (current.idCliente === 0) {
                await api.post('/cliente', current);
            } else {
                await api.put('/cliente', current);
            }
            Swal.fire('Éxito', 'Cliente guardado', 'success');
            setShowModal(false);
            loadClientes();
        } catch (err) {
            Swal.fire('Error', 'Error al guardar cliente', 'error');
        }
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Clientes</h2>
                <button onClick={() => { setCurrent({ idCliente: 0, nombre: '', correo: '', password: '', isAdmin: false }); setShowModal(true); }}>Agregar</button>
            </div>

            <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th>No</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Es Admin</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c, idx) => (
                        <tr key={c.idCliente}>
                            <td>{idx + 1}</td>
                            <td>{c.nombre}</td>
                            <td>{c.correo}</td>
                            <td>{c.isAdmin ? 'SÍ' : 'NO'}</td>
                            <td>
                                <button onClick={() => { setCurrent({ ...c, password: '' }); setShowModal(true); }}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
                        <h3>{current.idCliente === 0 ? 'Nuevo Cliente' : 'Editar Cliente'}</h3>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>Nombre:</label>
                            <input type="text" value={current.nombre} onChange={(e) => setCurrent({ ...current, nombre: e.target.value })} required />
                            <label>Correo:</label>
                            <input type="email" value={current.correo} onChange={(e) => setCurrent({ ...current, correo: e.target.value })} required />
                            <label>Password:</label>
                            <input type="password" value={current.password} onChange={(e) => setCurrent({ ...current, password: e.target.value })} placeholder={current.idCliente !== 0 ? 'Dejar vacío para no cambiar' : ''} required={current.idCliente === 0} />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Es Admin:
                                <input type="checkbox" checked={current.isAdmin} onChange={(e) => setCurrent({ ...current, isAdmin: e.target.checked })} />
                            </label>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px' }}>OK</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminClientes;
