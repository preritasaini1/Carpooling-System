export const calculateMatchScore = (ride, userRequest) => {
  let score = 0;

  // Pickup match
  if (
    ride.pickup.city.toLowerCase() === userRequest.pickup.toLowerCase()
  ) {
    score += 40;
  }

  // Drop match
  if (
    ride.drop.city.toLowerCase() === userRequest.drop.toLowerCase()
  ) {
    score += 40;
  }

  // Time match
  const rideTime = new Date(ride.departureTime);
  const userTime = new Date(userRequest.time);

  const diff = Math.abs(rideTime - userTime) / (1000 * 60 * 60);

  if (diff <= 1) {
    score += 20;
  }

  return score;
};

export const matchRides = (rides, userRequest) => {
  return rides
    .map((ride) => ({
      ...ride._doc,
      matchScore: calculateMatchScore(ride, userRequest),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};