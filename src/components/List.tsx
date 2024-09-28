
import React from 'react'

interface ListPropsType {
    data: any;
    renderItem:(item: any)=> React.ReactNode

}

const List = ({data, renderItem}: ListPropsType) => {
  return (
    data.map(renderItem)
  )
}

export default List