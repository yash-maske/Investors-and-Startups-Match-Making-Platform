import Navbar from '../navbar-startups/NavbarStartup'
import {Outlet} from 'react-router-dom'
export default function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>

  )
}
