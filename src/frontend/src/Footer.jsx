
export const Footer = () => {
  return (
    <>
      <footer className='footer'>
        <div className='container'>
          <div className='columns is-vcentered is-mobile'>
            {/* Left: Copyright Info */}
            <div className='column has-text-left custom-padding-left is-full-mobile has-text-centered-mobile'>
              <p className='text-colour'>&copy; 2024 GC Activity Rentals</p>
            </div>

            {/* Middle: Get In Touch */}
            <div className='column has-text-centered is-full-mobile'>
              <h1 className='text-colour'>Get In Touch</h1>
            </div>

            {/* Right: Icons */}
            <div className='column has-text-right is-full-mobile has-text-centered-mobile'>
              {/* Icons can be added here later */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
