import './adminlayout.css'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../admin-navbar/AdminNavbar'
export default function AdminLayout() {
    return (
        <>
            <AdminNavbar />
            <Outlet />
        </>
    )
}
