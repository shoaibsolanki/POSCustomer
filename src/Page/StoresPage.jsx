import React, { useEffect } from 'react'
import RestaurantCard from '../Componenets/RestaurantCard'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

const StoresPage = () => {
    const {store} = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        console.log(store)
     if(!store.length>0){
        navigate('/landing')
     }
    }, [store])
    const onClick=async(Store)=>{
        await localStorage.setItem('selectedStore', JSON.stringify(Store))
         // fetchAndSetProducts();
         navigate('/')
     }
  return (
    <>
    <h1 className='font-bold font-Inter text-2xl'>Popular near you</h1>
    {store.length >0? <div className='w-full mx-auto my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {store && store?.map((el)=>{return(<RestaurantCard store={el} onClick={onClick}   name={el.store_name} address={el.address} />)})}
    </div>: <div className='text-center text-lg font-medium bg-[#003f62] text-white'>No store found.</div>}
    </>
  )
}

export default StoresPage