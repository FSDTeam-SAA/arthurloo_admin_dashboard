
import React, { Suspense } from 'react'
import OtpForm from './_components/otp-form'

const OtpPage = () => {
  return (
    <div className='w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0'>
       <div className='md:col-span-1 flex items-center justify-center bg-gradient-to-b from-[#5C51E7] to-[#FFFFFF]'>
               <h2 className='text-[#1303CF] font-bold leading-normal text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>LVAI Studio</h2>
            </div>
      <div className='md:col-span-1 w-full flex items-center justify-center'>
        <Suspense fallback={<div>Loading...</div>}>
          <OtpForm />
        </Suspense>

      </div>
    </div>)
}
export default OtpPage