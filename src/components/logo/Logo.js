import React from 'react';
import ReactDOM from 'react-dom';
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './Logo.png'


const Logo = () =>{
	return(
		<div className='ma4 mt0'>
			<Tilt className="br2 shadow-2 backgroundTilt " style={{ height: '150px',width:'150px'}} >
		      <div className="pa3 ">
		        <img style={{paddingTop:'5px'}} src={brain}/>
		      </div>
		    </Tilt>
		</div>

		);
}

export default Logo;