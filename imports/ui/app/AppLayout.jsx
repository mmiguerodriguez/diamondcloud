import React from 'react';

import NavbarLayout from '../navbar/NavbarLayout.jsx';
import Footer from '../footer/Footer.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <NavbarLayout 
          image='//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOkcYIvpY_hVMZyXg-9VyubgjK139xag8A/s32-c-mo/photo.jpg'
          name='Ryan Itzcovitz'
          email='ryanitzcovitz@gmail.com'
        />
        { this.props.children }
        <Footer />
      </div>
    );
  }
}