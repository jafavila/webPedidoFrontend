import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Comprar from './views/Comprar';
import Carrito from './views/Carrito';
import MisPedidos from './views/MisPedidos';
import AdminProductos from './views/AdminProductos';
import AdminClientes from './views/AdminClientes';
import AdminPedidos from './views/AdminPedidos';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) return <Navigate to="/login" />;
    if (adminOnly && !user.isAdmin) return <Navigate to="/comprar" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/comprar" element={<PrivateRoute><Comprar /></PrivateRoute>} />
                <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
                <Route path="/mis-pedidos" element={<PrivateRoute><MisPedidos /></PrivateRoute>} />
                <Route path="/admin/productos" element={<PrivateRoute adminOnly={true}><AdminProductos /></PrivateRoute>} />
                <Route path="/admin/clientes" element={<PrivateRoute adminOnly={true}><AdminClientes /></PrivateRoute>} />
                <Route path="/admin/pedidos" element={<PrivateRoute adminOnly={true}><AdminPedidos /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/comprar" />} />
            </Routes>
        </Router>
    );
}

export default App;
