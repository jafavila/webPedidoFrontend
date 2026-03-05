import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import Swal from 'sweetalert2';

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState({ idProducto: 0, nombre: '', descripcion: '', existencia: 0, precio: 0 });

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const res = await api.get('/producto');
            setProductos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (current.idProducto === 0) {
                await api.post('/producto', current);
            } else {
                await api.put('/producto', current);
            }
            Swal.fire('Éxito', 'Producto guardado', 'success');
            setShowModal(false);
            loadProductos();
        } catch (err) {
            Swal.fire('Error', 'Error al guardar producto', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Borrar?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/producto/${id}`);
                loadProductos();
            } catch (err) {
                Swal.fire('Error', 'Error al borrar', 'error');
            }
        }
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Productos</h2>
                <button onClick={() => { setCurrent({ idProducto: 0, nombre: '', descripcion: '', existencia: 0, precio: 0 }); setShowModal(true); }}>Agregar</button>
            </div>

            <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th>No</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Existencia</th>
                        <th>Precio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((prod, idx) => (
                        <tr key={prod.idProducto}>
                            <td>{idx + 1}</td>
                            <td>{prod.nombre}</td>
                            <td>{prod.descripcion}</td>
                            <td>{prod.existencia}</td>
                            <td>${prod.precio.toFixed(2)}</td>
                            <td>
                                <button onClick={() => { setCurrent(prod); setShowModal(true); }}>Editar</button>
                                <button onClick={() => handleDelete(prod.idProducto)} style={{ color: 'red', marginLeft: '10px' }}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
                        <h3>{current.idProducto === 0 ? 'Nuevo Producto' : 'Editar Producto'}</h3>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>Producto:</label>
                            <input type="text" value={current.nombre} onChange={(e) => setCurrent({ ...current, nombre: e.target.value })} required />
                            <label>Descripción:</label>
                            <input type="text" value={current.descripcion} onChange={(e) => setCurrent({ ...current, descripcion: e.target.value })} required />
                            <label>Existencia:</label>
                            <input type="number" value={current.existencia} onChange={(e) => setCurrent({ ...current, existencia: parseInt(e.target.value) })} required />
                            <label>Precio:</label>
                            <input type="number" step="0.01" value={current.precio} onChange={(e) => setCurrent({ ...current, precio: parseFloat(e.target.value) })} required />
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

export default AdminProductos;
