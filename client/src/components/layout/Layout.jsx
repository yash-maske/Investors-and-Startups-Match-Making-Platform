import Navbar from '../navbar/Navbar'
import {Outlet} from 'react-router-dom'
export default function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>

  )
}
