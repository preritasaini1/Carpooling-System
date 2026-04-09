import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Ride from "../models/ride.model.js";

const seedData = async () => {
  try {
    await connectDB();

    await Ride.deleteMany();
    await User.deleteMany({ email: { $in: ["driver1@test.com", "driver2@test.com", "driver3@test.com"] } });

    const hashedPassword = await bcrypt.hash("123456", 10);

    const drivers = await User.insertMany([
      {
        fullName: "Driver One",
        email: "driver1@test.com",
        password: hashedPassword,
        phone: "9999999991",
        role: "driver",
      },
      {
        fullName: "Driver Two",
        email: "driver2@test.com",
        password: hashedPassword,
        phone: "9999999992",
        role: "driver",
      },
      {
        fullName: "Driver Three",
        email: "driver3@test.com",
        password: hashedPassword,
        phone: "9999999993",
        role: "driver",
      },
    ]);

    const rides = [
      {
        driver: drivers[0]._id,
        pickup: {
          address: "Sector 62",
          city: "Noida",
          coordinates: { lat: 28.6289, lng: 77.3649 },
        },
        drop: {
          address: "Cyber City",
          city: "Gurgaon",
          coordinates: { lat: 28.4947, lng: 77.0898 },
        },
        departureTime: new Date("2026-04-12T09:00:00.000Z"),
        availableSeats: 3,
        pricePerSeat: 150,
        vehicleDetails: {
          model: "Hyundai i20",
          plateNumber: "DL01AB1234",
          color: "White",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicAllowed: true,
          femaleOnly: false,
        },
        status: "open",
      },
      {
        driver: drivers[0]._id,
        pickup: {
          address: "Laxmi Nagar",
          city: "Delhi",
          coordinates: { lat: 28.6305, lng: 77.2773 },
        },
        drop: {
          address: "Sector 18",
          city: "Noida",
          coordinates: { lat: 28.5708, lng: 77.326 },
        },
        departureTime: new Date("2026-04-12T08:00:00.000Z"),
        availableSeats: 2,
        pricePerSeat: 80,
        vehicleDetails: {
          model: "Maruti Baleno",
          plateNumber: "DL02CD5678",
          color: "Blue",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: true,
          musicAllowed: true,
          femaleOnly: false,
        },
        status: "open",
      },
      {
        driver: drivers[1]._id,
        pickup: {
          address: "Vaishali",
          city: "Ghaziabad",
          coordinates: { lat: 28.647, lng: 77.3392 },
        },
        drop: {
          address: "Connaught Place",
          city: "Delhi",
          coordinates: { lat: 28.6315, lng: 77.2167 },
        },
        departureTime: new Date("2026-04-12T10:30:00.000Z"),
        availableSeats: 1,
        pricePerSeat: 120,
        vehicleDetails: {
          model: "Honda City",
          plateNumber: "UP14EF1111",
          color: "Black",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicAllowed: false,
          femaleOnly: false,
        },
        status: "open",
      },
      {
        driver: drivers[1]._id,
        pickup: {
          address: "Sector 15",
          city: "Noida",
          coordinates: { lat: 28.582, lng: 77.315 },
        },
        drop: {
          address: "MG Road",
          city: "Gurgaon",
          coordinates: { lat: 28.4791, lng: 77.0801 },
        },
        departureTime: new Date("2026-04-13T09:30:00.000Z"),
        availableSeats: 4,
        pricePerSeat: 140,
        vehicleDetails: {
          model: "Kia Sonet",
          plateNumber: "UP16GH2222",
          color: "Red",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicAllowed: true,
          femaleOnly: true,
        },
        status: "open",
      },
      {
        driver: drivers[2]._id,
        pickup: {
          address: "Raj Nagar Extension",
          city: "Ghaziabad",
          coordinates: { lat: 28.6867, lng: 77.4196 },
        },
        drop: {
          address: "Sector 62",
          city: "Noida",
          coordinates: { lat: 28.6289, lng: 77.3649 },
        },
        departureTime: new Date("2026-04-13T07:30:00.000Z"),
        availableSeats: 2,
        pricePerSeat: 90,
        vehicleDetails: {
          model: "Tata Punch",
          plateNumber: "UP14IJ3333",
          color: "Grey",
        },
        preferences: {
          smokingAllowed: true,
          petsAllowed: false,
          musicAllowed: true,
          femaleOnly: false,
        },
        status: "open",
      },
      {
        driver: drivers[2]._id,
        pickup: {
          address: "Janakpuri",
          city: "Delhi",
          coordinates: { lat: 28.6219, lng: 77.0878 },
        },
        drop: {
          address: "Airport Terminal 3",
          city: "Delhi",
          coordinates: { lat: 28.5562, lng: 77.1 },
        },
        departureTime: new Date("2026-04-14T06:00:00.000Z"),
        availableSeats: 3,
        pricePerSeat: 110,
        vehicleDetails: {
          model: "Swift Dzire",
          plateNumber: "DL08KL4444",
          color: "Silver",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicAllowed: true,
          femaleOnly: false,
        },
        status: "open",
      },
      {
        driver: drivers[0]._id,
        pickup: {
          address: "Indirapuram",
          city: "Ghaziabad",
          coordinates: { lat: 28.646, lng: 77.369 },
        },
        drop: {
          address: "Sector 18",
          city: "Noida",
          coordinates: { lat: 28.5708, lng: 77.326 },
        },
        departureTime: new Date("2026-04-14T11:00:00.000Z"),
        availableSeats: 1,
        pricePerSeat: 70,
        vehicleDetails: {
          model: "WagonR",
          plateNumber: "UP14MN5555",
          color: "White",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: true,
          musicAllowed: false,
          femaleOnly: false,
        },
        status: "full",
      },
      {
        driver: drivers[1]._id,
        pickup: {
          address: "Dwarka",
          city: "Delhi",
          coordinates: { lat: 28.5921, lng: 77.046 },
        },
        drop: {
          address: "Udyog Vihar",
          city: "Gurgaon",
          coordinates: { lat: 28.5005, lng: 77.0832 },
        },
        departureTime: new Date("2026-04-15T09:15:00.000Z"),
        availableSeats: 2,
        pricePerSeat: 130,
        vehicleDetails: {
          model: "Hyundai Verna",
          plateNumber: "DL09OP6666",
          color: "Black",
        },
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicAllowed: true,
          femaleOnly: false,
        },
        status: "open",
      }
    ];

    await Ride.insertMany(rides);

    console.log("Sample users and rides inserted successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();