
import { useState } from 'react';
import toast from 'react-hot-toast';
import LoginSignup from '../components/LoginSignup';
import { FaUser } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { baseURL } from '../main';

const AdminLogin = ()=> {

  const [type, setType] = useState('password'); // check type of input password
  const [formData, setFormData] = useState({ // form data both for doctor and patient
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update formData with the correct isDoctor value
      // Sending the formData to the backend
      const response = await axios.post(`${baseURL}/admin`, formData);
      console.log(response);
      if (response.status === 200) {
        toast.success('Login successful!');
        localStorage.setItem('medVisionToken', response.data.token);
        navigate('/admindashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  }
  //

  return (
    <div className='w-full h-screen flex justify-center items-center bg-[#E1EEFF]'>
    <div className='w-full max-w-[60%] shadow-lg h-fit py-[2rem] flex flex-col justify-center items-center rounded-[10px]'>
      <p className='font-[600] text-[1.8rem] my-[1rem] leading-[42px] text-[#00000099] uppercase'>Pharmacy Login</p>
      <form onSubmit={submitHandler} className='w-full h-fit flex flex-col gap-[2rem] justify-center items-center'>
        {/* email */}
        <div className='w-[50%] h-fit flex justify-between items-center border-b-[2px]  border-[#00000070]'>
          <input
            className='w-[90%] h-[3rem] bg-transparent outline-none font-ibm font-[400]  text-[1.1rem] leading-[26px] text-[#163048]'
            type="email"
            placeholder='Email'
            value={formData.email}
            name='email'
            onChange={handleChange}
          />
          <FaUser className='text-[#0078F070] text-[1.4rem]' />
        </div>

        {/* password */}
        <div className='w-[50%]  h-fit flex justify-between items-center border-b-[2px]  border-[#00000070]'>
          <input
            className='w-[90%] h-[3rem] bg-transparent outline-none font-ibm font-[400]  text-[1.1rem] leading-[26px] text-[#163048]'
            type={type}
            placeholder='Password'
            value={formData.password}
            name='password'
            onChange={handleChange}
          />
          {
            type === 'password' ?
              (<FaRegEyeSlash onClick={() => {
                setType('text');
              }} className='text-[#0078F070] text-[1.4rem] cursor-pointer' />)
              :
              (<FaRegEye onClick={() => {
                setType('password');
              }} className='text-[#0078F070] text-[1.4rem] cursor-pointer' />)
          }
        </div>
        <button className='w-[50%] border-2 border-[#0078F070] bg-[#0078F033] py-[1rem] rounded-md text-[#0078F0] font-[500]'>ENTER</button>
      </form>


    </div>
  </div>
  )
}

export default AdminLogin