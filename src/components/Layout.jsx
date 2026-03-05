import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.isAdmin;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '1000px', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>webPedido</h1>
                <nav>
                    <Link to="/comprar" style={{ margin: '0 10px' }}>Comprar</Link>
                    <Link to="/carrito" style={{ margin: '0 10px' }}>Carrito</Link>
                    {!isAdmin && <Link to="/mis-pedidos" style={{ margin: '0 10px' }}>Mis Pedidos</Link>}
                    {isAdmin && (
                        <>
                            <Link to="/admin/productos" style={{ margin: '0 10px', fontWeight: 'bold' }}>Admin Productos</Link>
                            <Link to="/admin/clientes" style={{ margin: '0 10px', fontWeight: 'bold' }}>Admin Clientes</Link>
                            <Link to="/admin/pedidos" style={{ margin: '0 10px', fontWeight: 'bold' }}>Admin Pedidos</Link>
                        </>
                    )}
                    <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Salir</button>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
