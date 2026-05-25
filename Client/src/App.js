import Navbar from "./Components/Navbar";
import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Components/Auth/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import Certificate from './Pages/Course/Certificate.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescripition from './Pages/Course/CourseDescription.jsx'
import CourseList from './Pages/Course/CourseList.jsx'
import CreateCourse from './Pages/Course/CreateCourse.jsx'
import EditCourse from './Pages/Course/EditCourse.jsx'
import Denied from './Pages/Denied.jsx'
import AddCourseLectures from './Pages/Deshboard/AddLectures.jsx'
import AdminDeshboard from './Pages/Deshboard/AdminDeshboard.jsx'
import Displaylectures from './Pages/Deshboard/DisplayLectures.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import ChangePassword from './Pages/Password/ChangePassword.jsx'
import ForgetPassword from './Pages/Password/ForgetPassword.jsx'
import ResetPassword from './Pages/Password/ResetPassword.jsx'
import CheckoutPage from './Pages/Payment/Checkout.jsx'
import CheckoutFailure from './Pages/Payment/CheckoutFailure.jsx'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess.jsx'
import Signup from './Pages/Signup.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import Profile from './Pages/User/Profile.jsx'

function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path='/courses' element={<CourseList/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/denied' element={<Denied/>} />
          <Route path='/course/description' element={<CourseDescripition/>} />

          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/forget-password' element={<ForgetPassword/>} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />

          <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
            <Route path='/course/create' element={<CreateCourse/>} />
            <Route path='/course/edit' element={<EditCourse/>} />
            <Route path='/course/addlecture' element={<AddCourseLectures/>} />
            <Route path='/admin/deshboard' element={<AdminDeshboard/>} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN", 'USER']}/>}>
            <Route path='/user/profile' element={<Profile/>} />
            <Route path='/user/editprofile' element={<EditProfile/>} />
            <Route path='/change-password' element={<ChangePassword/>} />
            <Route path='/checkout' element={<CheckoutPage/>} />
            <Route path='/checkout/success' element={<CheckoutSuccess/>} />
            <Route path='/checkout/fail' element={<CheckoutFailure/>} />
            <Route path='/course/displaylecture' element={<Displaylectures/>} />
            <Route path='/course/certificate' element={<Certificate/>} />
          </Route>

          <Route path='*' element={<NotFound/>} />
      </Routes>
    </>
  )
}

export default App