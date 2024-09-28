"use client"
import React, { useState } from 'react'

const Input = ({getData, placeholderText}: any) => {
    const [inputValue, setInputValue] = useState()
    const [data, setData] = useState()
    const handleChange = async(e: any) => {
        const {value} = e.target;
        setInputValue(value)
    }

    const handleSearch = async() => {
        let data = await getData(inputValue)
        setData(data)
    }
  return (
    <div className='flex'>
        <input
        value={inputValue}
        onChange={handleChange}
        name='search-input'
        className='btn-outline'
        placeholder={placeholderText}
        />
        <button onClick={handleSearch} className='btn-dark-filled w-1/12 rounded-none'>search</button>
        <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export default Input