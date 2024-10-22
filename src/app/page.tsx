import Link from 'next/link'

const HomePage = () => {
  
  return (
    <section className='flex-center'>
    <h2 className='text-2xl'>Hello Friends,</h2>
    <p className='text-4xl my-3'>Welcome to Feedback tracker application </p>
    <Link href={'/sign-in'} className='btn-outline no-underline'>Login</Link>
    </section>
  )
}

export default HomePage