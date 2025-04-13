import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing'
import Login from './components/login/Login'
import Register from './components/register/Register'
import StartUp from './components/startups/StartUp';
import Appllication from './pages/application/Application'
import ProfileInput from './components/profileinput/ProfileInput';
import Admin from './pages/admin/Admin';
import AdminHome from './components/adminhome/AdminHome'
import Verify from './components/verification/Verify'
import StartupInput from './components/startup-profile/StartUpProfileInput'
import Discover from './components/discover/Discover';
import Result from './components/discoverresult/Result'
import VerifyStartUp from './components/verfystartups/Verify';
import Investor from './components/investors/Investors'
import StartUpLayout from './pages/startups/StartUpLayout';
import CreateEvent from './components/react-check/CreateEvent';
import StartupTabs from './components/my-applications/StartUpTabs';
import MyApplication from './components/startup-application/StartUp-Applications';
import InMeet from './components/investor-meet/Inmeet'
import StartUpMeet from './components/startup-meet/Stmeet'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path='/profile-input' element={<ProfileInput />} />
      <Route path='/startup-profile' element={<StartupInput/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/application' element={<Appllication />}>
      <Route path="startups" element={<StartUp />} />
      <Route path='discover-startups' element={<Discover/>}/>
      <Route path='discover-results'element={<Result/>}/>
      <Route path='myinvestment'element={<StartupTabs/>}/>
      <Route path='inmeet'element={<InMeet/>}/>
      </Route>

<Route path='/statrtups' element={<StartUpLayout/>}>
<Route path='allinvestors' element={<Investor/>}/>
<Route path='applications' element={<MyApplication/>}/>
<Route path='stmeet' element={<StartUpMeet/>}/>


</Route>



      <Route path='/admin' element={<Admin />}>
        <Route path='home' element={<AdminHome />} />
        <Route path='verify-investor' element={<Verify />} />
        <Route path='verify-startup' element={<VerifyStartUp />} />
      </Route>

      <Route path='abc' element={<CreateEvent/>}/>
    </Routes>



  )
}

export default App
