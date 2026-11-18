"use client"
import React from 'react'
import ProductCard from './ProductCard';

export default function ProductsList({ data = [], path = "" }) {
  return (
    <>
          {                    
            data.map((obj)=>{
              return(
                <ProductCard key={obj._id} productData={obj} path={path} />
              )
            })
          } 
    </>
  )
}
