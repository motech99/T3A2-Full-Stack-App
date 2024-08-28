

export const Footer = () => {
  return (
    <>
      <footer className='footer'>
        <div className='container'>
          <div className='columns is-vcentered is-mobile'>
            {/* Left: Copyright Info */}
            <div className='column has-text-left is-full-mobile has-text-centered-mobile'>
              <p className='footer-heading'>&copy; 2024 GC Activity Rentals</p>
            </div>

            {/* Middle: Get In Touch */}
            <div className='column has-text-centered is-full-mobile'>
              <h1>
                <strong className='footer-heading'>Get In Touch</strong>
              </h1>
            </div>

            {/* Right: Icons */}
            <div className='column has-text-right is-full-mobile has-text-centered-mobile'>
              {/* Icons */}
              <a href='https://github.com/motech99/T3A2-Full-Stack-App'>
                <i className='fa-brands fa-github fa-xl'></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
