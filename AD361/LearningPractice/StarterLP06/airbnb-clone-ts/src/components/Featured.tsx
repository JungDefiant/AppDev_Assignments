const featuredRental = {
  name: "Penthouse Suite",
  price: 600,
  location: "New York City, NY",
};

const Featured = () => {
  return (
    <div className="featured">
      <h2>🌟 Featured Rental 🌟</h2>
      <h3>{featuredRental.name}</h3>
      <p>Location: {featuredRental.location}</p>
      <p>Price: ${featuredRental.price} per night</p>
    </div>
  );
};

export default Featured;
