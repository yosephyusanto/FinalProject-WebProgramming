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
      <button onClick={decreaseStock} disabled={stock === 1}>-</button>
      <input type="number" value={stock} min="1" readOnly/>
      <button onClick={increaseStock} disabled={stock === max_stock}>+</button>
    </div>  
  )
}

export default Stock