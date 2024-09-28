'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const page = () => {
    const { data: session } = useSession()
  return (
    <div>Dashboard
         <p>Signed in as {session?.user.email}</p>
    </div>
  )
}

export default page