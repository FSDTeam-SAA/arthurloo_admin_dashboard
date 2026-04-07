
import React from 'react'
import LoginForm from './_components/login-form'

const LoginPage = () => {
    return (
        <div className='w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0'>
            <div className='md:col-span-1 flex items-center justify-center bg-gradient-to-b from-[#5C51E7] to-[#FFFFFF]'>
               <h2 className='text-[#1303CF] font-bold leading-normal text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>LVAI Studio</h2>
            </div>
            <div className='md:col-span-1 flex items-center justify-center'>
                <LoginForm />
            </div>
        </div>)
}
export default LoginPage