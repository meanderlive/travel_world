

// import React, {useState} from 'react'
// import './booking.css'
// import {Form, FormGroup, ListGroup, ListGroupItem, Button} from "reactstrap";

// import { useNavigate } from 'react-router-dom';

// const Booking = ({tour, avgRating}) => {

//   const user = JSON.parse(localStorage.getItem('user'));
//   console.log('user', user)
//   const userData = user.data

//   const {price, reviews} = tour
//   const navigate = useNavigate()

//   const [credentials, setCredentials] = useState({
//     userId: userData._id,
//     userEmail: userData.email,
//     fullName: '',
//     phone: '',  
//     guestSize:1,
//     bookAt : ''
//   })

//   const handleChange = (e) => {
//     setCredentials(prev=>({...prev, [e.target.id]: e.target.value}))
//   }

//   // send data to the server
//   const handleClick = (e) => {
//     e.preventDefault()

//     navigate('/thank-you')
//   }

//   const serviceFee = 10;
//   const totalAmount = Number(price) * Number(credentials.guestSize) + Number(serviceFee);


//   return (
//     <div className='booking'>
//       <div className="booking__top d-flex align-items-center justify-content-between">
//         <h3>${price} <span>/per person</span></h3>
//         <span className='tour__rating d-flex  align-items-center gap-1'>
//             <i class="ri-star-fill"></i>{avgRating === 0? null:avgRating} ({reviews?.length})
//           </span>
//       </div>

//       {/*WWWWWWWWWWWWWWWWWWWW BOOKING FORM START WWWWWWWWWWWWWWWWWWWWWWWWWWWW*/}
//       {/*WWWWWWWWWW MODIFIER SYSTEME DE VALIDATION WWWWWWWWWWWWWWWWWWWWWWWWWWWWW*/}
//       <div className="booking__form">
//         <h5>Information</h5>
//         <Form className='booking__info-form' onSubmit={handleClick}>
//           <FormGroup>
//             <input type="text" placeholder='Full Name' id='fullName' required onChange={handleChange} />
//           </FormGroup>
//           <FormGroup>
//             <input type="number" placeholder='Phone' id='phone' required onChange={handleChange}/>
//           </FormGroup>
//           <FormGroup className='d-flex align-items-center gap-3'>
//             <input type="date" placeholder='' id='bookAt' required onChange={handleChange}/>
//             <input type="number" placeholder='Guest' id='guestSize' required onChange={handleChange}/>
//           </FormGroup>
//         </Form>
//       </div>
//       {/*WWWWWWWWWWWWWWWWWWWW BOOKING FORM END   WWWWWWWWWWWWWWWWWWWWWWWWWWWW*/}

//       {/*WWWWWWWWWWWWWWWWWWWW BOOKING BOTTOM START WWWWWWWWWWWWWWWWWWWWWWWWWWWW*/}
//       <div className="booking__bottom">
//         <ListGroup>
//           <ListGroupItem className='border-0 px-0'>
//             <h5 className='d-flex align-items-center gap-1'>
//               ${price}
//               <i className='ri-close-line'></i>
//               1 person
//             </h5>
//             <span>
//               ${price}
//             </span>
//           </ListGroupItem>
//           <ListGroupItem className='border-0 px-0'>
//             <h5>
//               Service charge
//             </h5>
//             <span>
//               ${serviceFee}
//             </span>
//           </ListGroupItem>
//           <ListGroupItem className='border-0 px-0 total'>
//             <h5>
//               Total 
//             </h5>
//             <span>
//               ${totalAmount}
//             </span>
//           </ListGroupItem>
//         </ListGroup>

//         <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>
//           Book Now
//         </Button>
//       </div>
//       {/*WWWWWWWWWWWWWWWWWWWW BOOKING BOTTOM END   WWWWWWWWWWWWWWWWWWWWWWWWWWWW*/}

//     </div>
//   )
// }

// export default Booking


import React, { useState } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = ({ tour, avgRating }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user', user);
  const userData = user?.data;
  console.log('tourtour', tour)

  const { price, reviews } = tour;
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    userId: userData?._id,
    userEmail: userData?.email,
    tourName: tour?.title,
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: ''
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log('Submitting credentials:', credentials);

    try {
      const response = await axios.post('http://localhost:4000/api/v1/booking/', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log('Booking successful:', response.data);
        navigate('/thank-you');
      } else {
        console.error('Failed to book the tour:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error occurred while booking the tour:', error);
    }
  };

  const serviceFee = 10;
  const totalAmount = Number(price) * Number(credentials.guestSize) + Number(serviceFee);

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="number" placeholder="Phone" id="phone" required onChange={handleChange} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" placeholder="" id="bookAt" required onChange={handleChange} />
            <input type="number" placeholder="Guest" id="guestSize" required onChange={handleChange} />
          </FormGroup>
          <Button type="submit" className="btn primary__btn w-100 mt-4">
            Book Now
          </Button>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price}
              <i className="ri-close-line"></i>
              1 person
            </h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
};

export default Booking;
