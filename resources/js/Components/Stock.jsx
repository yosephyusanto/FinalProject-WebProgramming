import React, { useState } from 'react'

const Stock = ({max_stock}) => {
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
    <div className='flex items-center border rounded-lg w-max'>
      <button onClick={decreaseStock} disabled={stock === 1} className='px-3 py-2 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100'>-</button>
      <input type="number" value={stock} min="1" readOnly/>
      <button onClick={increaseStock} disabled={stock === max_stock} className='px-3 py-2 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100'>+</button>
    </div>  
  )
}

export default Stock