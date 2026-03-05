import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import Swal from 'sweetalert2';

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        loadPedidos();
    }, []);

    const loadPedidos = async () => {
        try {
            const res = await api.get('/pedido');
            setPedidos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVer = async (ped) => {
        try {
            const res = await api.get(`/pedido/${ped.idPedido}/detalle`);
            setCurrent({ ...ped, detalles: res.data });
            setShowModal(true);
        } catch (err) {
            Swal.fire('Error', 'Error al obtener detalles', 'error');
        }
    };

    return (
        <Layout>
            <h2>Mis Pedidos</h2>
            {pedidos.length === 0 ? (
                <p>No tienes pedidos registrados.</p>
            ) : (
                <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estatus</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((ped) => (
                            <tr key={ped.idPedido}>
                                <td>{ped.idPedido}</td>
                                <td>{new Date(ped.fecha).toLocaleString()}</td>
                                <td>${ped.total.toFixed(2)}</td>
                                <td>{ped.estatus ? 'Activo' : 'Cancelado'}</td>
                                <td>
                                    <button onClick={() => handleVer(ped)}>Ver Detalle</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && current && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3>Detalle de Pedido #{current.idPedido}</h3>
                        <p><strong>Fecha:</strong> {new Date(current.fecha).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${current.total.toFixed(2)}</p>
                        <p><strong>Estatus:</strong> {current.estatus ? 'Activo' : 'Cancelado'}</p>

                        <h4>Productos</h4>
                        <table border="1" width="100%" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <th>No</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {current.detalles.map((det, idx) => (
                                    <tr key={det.idPedidoDetalle}>
                                        <td>{idx + 1}</td>
                                        <td>{det.producto}</td>
                                        <td>{det.cantidad}</td>
                                        <td>${det.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px' }}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default MisPedidos;
