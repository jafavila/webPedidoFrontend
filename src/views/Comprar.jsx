import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Comprar = () => {
    const [productos, setProductos] = useState([]);
    const [search, setSearch] = useState('');
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
    const navigate = useNavigate();

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

    const handleAddToCart = (prod, cant) => {
        if (cant <= 0) return;
        if (cant > prod.existencia) {
            Swal.fire('Atención', 'No hay suficiente existencia', 'warning');
            return;
        }

        const nuevoCarrito = [...carrito];
        const index = nuevoCarrito.findIndex(p => p.idProducto === prod.idProducto);
        if (index > -1) {
            nuevoCarrito[index].cantidad += parseInt(cant);
            nuevoCarrito[index].total = nuevoCarrito[index].cantidad * prod.precio;
        } else {
            nuevoCarrito.push({
                idProducto: prod.idProducto,
                producto: prod.nombre,
                descripcion: prod.descripcion,
                precio: prod.precio,
                cantidad: parseInt(cant),
                total: prod.precio * cant
            });
        }
        setCarrito(nuevoCarrito);
        localStorage.setItem('cart', JSON.stringify(nuevoCarrito));
        Swal.fire('Éxito', 'Agregado al carrito', 'success');
    };

    const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <h2>Bienvenido</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button onClick={() => navigate('/carrito')}>Ver Carrito ({carrito.length})</button>
            </div>

            <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th>No</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((prod, idx) => (
                        <tr key={prod.idProducto}>
                            <td>{idx + 1}</td>
                            <td>{prod.nombre}</td>
                            <td>{prod.descripcion}</td>
                            <td>${prod.precio.toFixed(2)}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input type="number" defaultValue="1" min="1" max={prod.existencia} id={`cant-${prod.idProducto}`} style={{ width: '50px' }} />
                                    <button onClick={() => {
                                        const cant = document.getElementById(`cant-${prod.idProducto}`).value;
                                        handleAddToCart(prod, cant);
                                    }}>Agregar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default Comprar;
