import React, { useState } from 'react'

const StockInput = ({max_stock}) => {
  const [stock, setStock] = useState(1)
  const increaseStock = () => {
    if(stock < max_stock){
      setStock(stock + 1)
    }
  }

  const decreaseStock = () => {
    if(stock > 1){
      setStock(stock - 1)
    }
  }
  
  return (
    <div className='flex items-center border rounded-lg'>
      <button onClick={decreaseStock} disabled={stock === 1} className='px-3 py-2 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100'>-</button>
      <input className='w-12 text-center outline-none' type="number" value={stock} min="1" readOnly/>
      <button onClick={increaseStock} disabled={stock === max_stock} className='px-3 py-2 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100'>+</button>
    </div>  
  )
}

export default StockInput