import { Link } from "react-router-dom"
import './Error.css'

import img from '../assets/not-found.svg'

export const Error = () => {
  return (
    <>
      <div className='wrapper'>
        <img className='error-img' src={img} alt='not found' />
        <h1 className='error-font'>Page not found!</h1>
        <h2 className='error-font-sub'>
          We can't seem to find the page you are looking for
        </h2>
        <p className='error-font'>
          Return to <Link to='/' className='error-font error-font-p'>
            Homepage
          </Link>
        </p>
      </div>
    </>
  );
}