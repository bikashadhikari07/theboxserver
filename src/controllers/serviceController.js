// import ServiceBooking from "../models/ServiceBooking.js";

// export const bookService = async (req, res) => {
//   const { serviceName, serviceDate, notes } = req.body;

//   const booking = await ServiceBooking.create({
//     user: req.user._id,
//     serviceName,
//     serviceDate,
//     notes,
//   });

//   res.status(201).json(booking);
// };

// export const getUserBookings = async (req, res) => {
//   const bookings = await ServiceBooking.find({ user: req.user._id });
//   res.json(bookings);
// };
