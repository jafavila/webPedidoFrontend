import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
    const navigate = useNavigate();

    const handleRemove = (idx) => {
        const nuevo = carrito.filter((_, i) => i !== idx);
        setCarrito(nuevo);
        localStorage.setItem('cart', JSON.stringify(nuevo));
    };

    const handleEdit = (idx, cant) => {
        if (cant <= 0) return;
        const nuevo = [...carrito];
        nuevo[idx].cantidad = parseInt(cant);
        nuevo[idx].total = nuevo[idx].cantidad * nuevo[idx].precio;
        setCarrito(nuevo);
        localStorage.setItem('cart', JSON.stringify(nuevo));
    };

    const handleComprar = async () => {
        if (carrito.length === 0) return;

        const pedido = {
            detalles: carrito.map(item => ({
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                total: item.total
            })),
            total: carrito.reduce((acc, item) => acc + item.total, 0)
        };

        try {
            await api.post('/pedido', pedido);
            Swal.fire('Éxito', 'Compra realizada correctamente', 'success').then(() => {
                localStorage.removeItem('cart');
                setCarrito([]);
                navigate('/comprar');
            });
        } catch (err) {
            Swal.fire('Error', 'Hubo un problema al procesar su pedido', 'error');
        }
    };

    const total = carrito.reduce((acc, item) => acc + item.total, 0);

    return (
        <Layout>
            <h2>Carrito de compras</h2>
            <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th>No</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.producto}</td>
                            <td>{item.descripcion}</td>
                            <td>${item.precio.toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(e) => handleEdit(idx, e.target.value)}
                                    style={{ width: '50px' }}
                                />
                            </td>
                            <td>${item.total.toFixed(2)}</td>
                            <td>
                                <button onClick={() => handleRemove(idx)} style={{ color: 'red' }}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <h3>Total: ${total.toFixed(2)}</h3>
                <button
                    onClick={handleComprar}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
                >
                    Comprar
                </button>
            </div>
        </Layout>
    );
};

export default Carrito;
