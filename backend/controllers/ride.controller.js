import Ride from "../models/ride.model.js";

export const createRide = async (req, res, next) => {
  try {
    const {
      pickup,
      drop,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicleDetails,
      preferences,
    } = req.body;

    if (!pickup || !drop || !departureTime || !availableSeats || pricePerSeat == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required ride details",
      });
    }

    const ride = await Ride.create({
      driver: req.userId,
      pickup,
      drop,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicleDetails,
      preferences,
    });

    res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

export const getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "fullName email phone role")
      .populate("passengers", "fullName email");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ driver: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

export const searchRides = async (req, res, next) => {
  try {
    const { pickupCity, dropCity, seats, status, date } = req.query;

    const query = {};

    if (pickupCity) {
      query["pickup.city"] = { $regex: pickupCity, $options: "i" };
    }

    if (dropCity) {
      query["drop.city"] = { $regex: dropCity, $options: "i" };
    }

    if (seats) {
      query.availableSeats = { $gte: Number(seats) };
    }

    if (status) {
      query.status = status;
    } else {
      query.status = "open";
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.departureTime = {
        $gte: start,
        $lt: end,
      };
    }

    const rides = await Ride.find(query)
      .populate("driver", "fullName email role")
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};