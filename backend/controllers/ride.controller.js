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
    const {
      pickupCity,
      dropCity,
      date,
      fromTime,
      toTime,
      seats,
      status,
      femaleOnly,
      petsAllowed,
      musicAllowed,
    } = req.query;

    if (!pickupCity || !dropCity || !date) {
      return res.status(400).json({
        success: false,
        message: "pickupCity, dropCity, and date are required to search rides",
      });
    }

    const query = {
      "pickup.city": { $regex: pickupCity, $options: "i" },
      "drop.city": { $regex: dropCity, $options: "i" },
      status: status || "open",
    };

    if (seats) {
      query.availableSeats = { $gte: Number(seats) };
    }

    if (femaleOnly !== undefined) {
      query["preferences.femaleOnly"] = femaleOnly === "true";
    }

    if (petsAllowed !== undefined) {
      query["preferences.petsAllowed"] = petsAllowed === "true";
    }

    if (musicAllowed !== undefined) {
      query["preferences.musicAllowed"] = musicAllowed === "true";
    }

    let startDateTime;
    let endDateTime;

    if (fromTime && toTime) {
      startDateTime = new Date(`${date}T${fromTime}:00`);
      endDateTime = new Date(`${date}T${toTime}:00`);
    } else if (fromTime) {
      startDateTime = new Date(`${date}T${fromTime}:00`);
      endDateTime = new Date(`${date}T23:59:59`);
    } else if (toTime) {
      startDateTime = new Date(`${date}T00:00:00`);
      endDateTime = new Date(`${date}T${toTime}:00`);
    } else {
      startDateTime = new Date(`${date}T00:00:00`);
      endDateTime = new Date(`${date}T23:59:59`);
    }

    query.departureTime = {
      $gte: startDateTime,
      $lte: endDateTime,
    };

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