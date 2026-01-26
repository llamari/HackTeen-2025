import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Pages/Login';
import Password from './Pages/ForgotPassword';
import Home from './Pages/Home';
import UserRegistration from './Pages/SignUp';
import { History } from './Pages/History';
import { Objectives } from './Pages/Objectives';
import { AllRooms } from './Pages/AllRooms';

function Route1() { 
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/signup' element={<UserRegistration/>}/>
                <Route path='/forgot/password' element={<Password/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/history' element={<History/>}/>
                <Route path='/objectives' element={<Objectives/>}/>
                <Route path='/rooms' element={<AllRooms/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Route1; 