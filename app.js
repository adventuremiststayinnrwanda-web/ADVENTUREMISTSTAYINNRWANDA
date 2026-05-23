const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK_TEST-REPLACE_WITH_YOUR_KEY";
const TAX_RATE = 0.15;

const starterHotels = [
  {
    id: "h-001",
    name: "Aurora Grand Hotel",
    city: "Cape Town",
    rating: 4.8,
    priceFrom: 1420,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    description:
      "A polished coastal hotel with mountain views, spacious suites, and calm service.",
    amenities: ["WiFi", "Pool", "Parking", "Gym", "Restaurant", "Air conditioning"],
    rooms: [
      {
        id: "r-001",
        name: "Deluxe Ocean Room",
        price: 1420,
        capacity: 2,
        bed: "King bed",
        size: "38 sqm",
        status: "Available",
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["Balcony", "TV", "Hot shower", "Breakfast"],
        details:
          "Ocean-facing room with private balcony, premium bedding, fast WiFi, breakfast, work desk, and daily housekeeping."
      },
      {
        id: "r-002",
        name: "Executive Mountain Suite",
        price: 2180,
        capacity: 3,
        bed: "King bed + sofa",
        size: "55 sqm",
        status: "Available",
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["Lounge", "TV", "Breakfast", "Air conditioning"],
        details:
          "Large suite with mountain view, separate lounge corner, sofa bed, minibar, and executive work area."
      }
    ]
  },
  {
    id: "h-002",
    name: "Harbor Atelier",
    city: "Durban",
    rating: 4.6,
    priceFrom: 980,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
    description:
      "A city harbor stay with comfortable rooms, easy beach access, and practical amenities.",
    amenities: ["WiFi", "Parking", "Restaurant", "Air conditioning"],
    rooms: [
      {
        id: "r-003",
        name: "Classic Queen Room",
        price: 980,
        capacity: 2,
        bed: "Queen bed",
        size: "30 sqm",
        status: "Available",
        images: [
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["TV", "Hot shower", "Air conditioning"],
        details:
          "Quiet queen room with blackout curtains, clean bathroom, air conditioning, and reliable WiFi."
      },
      {
        id: "r-004",
        name: "Family Studio",
        price: 1560,
        capacity: 4,
        bed: "Two queen beds",
        size: "48 sqm",
        status: "Fully booked",
        images: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["TV", "Breakfast", "Mini fridge"],
        details:
          "Family room with two queen beds, breakfast, minibar fridge, and extra luggage space."
      }
    ]
  },
  {
    id: "h-003",
    name: "Garden Court Luxe",
    city: "Johannesburg",
    rating: 4.7,
    priceFrom: 1250,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
    description:
      "A modern urban hotel with garden spaces, business rooms, and quick city access.",
    amenities: ["WiFi", "Pool", "Parking", "Gym", "Restaurant"],
    rooms: [
      {
        id: "r-005",
        name: "Garden King Room",
        price: 1250,
        capacity: 2,
        bed: "King bed",
        size: "35 sqm",
        status: "Available",
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["TV", "Breakfast", "Work desk"],
        details:
          "Garden-facing king room with breakfast, work desk, soft lighting, and quiet business-friendly layout."
      },
      {
        id: "r-006",
        name: "Business Twin Room",
        price: 1320,
        capacity: 2,
        bed: "Two twin beds",
        size: "34 sqm",
        status: "Maintenance",
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ],
        features: ["TV", "Hot shower", "Work desk"],
        details:
          "Twin room for business travelers, currently in maintenance mode until admin marks it available."
      }
    ]
  }
];

let hotels = load("hotels", starterHotels);
let bookings = load("bookings", [
  {
    customer: "Maya Dlamini",
    email: "maya@example.com",
    phone: "+27 82 555 0101",
    reference: "SE-2026-00124",
    transactionId: "FLW-DEMO-001",
    hotelId: "h-001",
    roomId: "r-001",
    hotel: "Aurora Grand Hotel",
    room: "Deluxe Ocean Room",
    checkIn: "2026-06-01",
    checkOut: "2026-06-03",
    nights: 2,
    status: "Confirmed",
    paymentStatus: "Paid",
    amount: 3266
  }
]);

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0
});

const byId = (id) => document.querySelector(id);
const hotelGrid = byId("#hotelGrid");
const roomList = byId("#roomList");
const cityFilter = byId("#cityFilter");
const priceFilter = byId("#priceFilter");
const modal = byId("#bookingModal");
const modalContent = byId("#modalContent");
const closeModal = byId("#closeModal");
const ADMIN_EMAIL = "admin@stayease.test";
const ADMIN_PASSWORD = "Admin123";

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`stayease:${key}`)) || fallback;
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem("stayease:hotels", JSON.stringify(hotels));
  localStorage.setItem("stayease:bookings", JSON.stringify(bookings));
}

function findRoom(roomId) {
  for (const hotel of hotels) {
    const room = hotel.rooms.find((item) => item.id === roomId);
    if (room) return { hotel, room };
  }
  return null;
}

function calculateStay(roomPrice, checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  const nights = Number.isFinite(diff) && diff > 0 ? Math.ceil(diff / 86400000) : 0;
  const subtotal = roomPrice * nights;
  const taxes = Math.round(subtotal * TAX_RATE);
  return { nights, subtotal, taxes, total: subtotal + taxes };
}

function todayOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function renderHotels() {
  const city = cityFilter.value;
  const price = priceFilter.value;
  const filtered = hotels.filter((hotel) => {
    const cityMatch = city === "all" || hotel.city === city;
    const priceMatch =
      price === "all" ||
      (price === "under1200" && hotel.priceFrom < 1200) ||
      (price === "over1200" && hotel.priceFrom >= 1200);
    return cityMatch && priceMatch;
  });

  hotelGrid.innerHTML = filtered
    .map(
      (hotel) => `
        <article class="hotel-card">
          <img src="${hotel.image}" alt="${hotel.name}" />
          <div class="hotel-body">
            <div class="card-top">
              <div>
                <h3>${hotel.name}</h3>
                <p class="muted">${hotel.city}, South Africa</p>
              </div>
              <span class="rating">Star ${hotel.rating}</span>
            </div>
            <p class="muted">${hotel.description}</p>
            <div class="pill-row">
              ${hotel.amenities.slice(0, 5).map((item) => `<span class="pill">${item}</span>`).join("")}
            </div>
            <div class="hotel-actions">
              <strong>From ${currency.format(hotel.priceFrom)}</strong>
              <button type="button" class="light-button" data-hotel="${hotel.id}">View Rooms</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-hotel]").forEach((button) => {
    button.addEventListener("click", () => {
      renderRooms(button.dataset.hotel);
      byId("#rooms").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderRooms(hotelId = "all") {
  const rooms = hotels
    .filter((hotel) => hotelId === "all" || hotel.id === hotelId)
    .flatMap((hotel) => hotel.rooms.map((room) => ({ hotel, room })));

  roomList.innerHTML = rooms
    .map(({ hotel, room }) => {
      const available = room.status === "Available";
      return `
        <article class="room-card">
          <img src="${room.images[0]}" alt="${room.name}" />
          <div class="room-body">
            <div class="card-top">
              <div>
                <h3>${room.name}</h3>
                <p class="muted">${hotel.name} | ${hotel.city} | Up to ${room.capacity} guests | ${room.bed} | ${room.size}</p>
              </div>
              <span class="status ${available ? "" : "unavailable"}">${room.status}</span>
            </div>
            <p class="muted">${room.details}</p>
            <div class="pill-row">
              ${room.features.map((item) => `<span class="pill">${item}</span>`).join("")}
            </div>
            <div class="room-actions">
              <strong>${currency.format(room.price)} per night</strong>
              <span>
                <button type="button" class="light-button" data-details="${room.id}">Details</button>
                <button type="button" ${available ? "" : "disabled"} data-room="${room.id}">
                  ${available ? "Book Room" : "Unavailable"}
                </button>
              </span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-room]").forEach((button) => {
    button.addEventListener("click", () => openBooking(button.dataset.room));
  });
  document.querySelectorAll("[data-details]").forEach((button) => {
    button.addEventListener("click", () => openRoomDetails(button.dataset.details));
  });
}

function openRoomDetails(roomId) {
  const found = findRoom(roomId);
  if (!found) return;
  const { hotel, room } = found;

  modalContent.innerHTML = `
    <p class="eyebrow">${hotel.name}</p>
    <h2 id="modalTitle">${room.name}</h2>
    <div class="gallery-main">
      <img id="activeRoomImage" src="${room.images[0]}" alt="${room.name}" />
    </div>
    <div class="gallery-thumbs">
      ${room.images.map((image) => `<button type="button" data-image="${image}"><img src="${image}" alt="${room.name}" /></button>`).join("")}
    </div>
    <p class="muted">${room.details}</p>
    <div class="pill-row">
      ${room.features.map((item) => `<span class="pill">${item}</span>`).join("")}
    </div>
    <div class="summary">
      <div><span>Capacity</span><strong>${room.capacity} guests</strong></div>
      <div><span>Bed</span><strong>${room.bed}</strong></div>
      <div><span>Size</span><strong>${room.size}</strong></div>
      <div><span>Price</span><strong>${currency.format(room.price)} per night</strong></div>
    </div>
    <button type="button" ${room.status === "Available" ? "" : "disabled"} data-room="${room.id}">
      ${room.status === "Available" ? "Start Booking" : "Unavailable"}
    </button>
  `;
  openModal();

  document.querySelectorAll("[data-image]").forEach((button) => {
    button.addEventListener("click", () => {
      byId("#activeRoomImage").src = button.dataset.image;
    });
  });
  document.querySelector("[data-room]")?.addEventListener("click", () => openBooking(room.id));
}

function openBooking(roomId) {
  const found = findRoom(roomId);
  if (!found) return;
  const { hotel, room } = found;
  const defaultIn = todayOffset(1);
  const defaultOut = todayOffset(3);

  modalContent.innerHTML = `
    <p class="eyebrow">Guest checkout</p>
    <h2 id="modalTitle">${room.name}</h2>
    <p class="muted">${hotel.name}, ${hotel.city}. No registration required.</p>
    <form class="panel" id="bookingForm">
      <div class="booking-grid">
        <label><span>Check-in</span><input id="checkIn" type="date" value="${defaultIn}" required /></label>
        <label><span>Check-out</span><input id="checkOut" type="date" value="${defaultOut}" required /></label>
        <label><span>Guests</span><select id="guestCount">${Array.from({ length: room.capacity }, (_, index) => `<option>${index + 1}</option>`).join("")}</select></label>
        <label><span>Full name</span><input id="guestName" placeholder="Your full name" required /></label>
        <label><span>Email</span><input id="guestEmail" type="email" placeholder="you@example.com" required /></label>
        <label><span>Phone</span><input id="guestPhone" placeholder="+27..." required /></label>
      </div>
      <div class="summary" id="priceSummary"></div>
      <button type="submit">Pay Now</button>
      <p class="muted small-note">Flutterwave opens for live card payment when a real public key is configured. Demo mode confirms the flow locally.</p>
    </form>
  `;
  openModal();

  const updateSummary = () => {
    const stay = calculateStay(room.price, byId("#checkIn").value, byId("#checkOut").value);
    byId("#priceSummary").innerHTML = `
      <div><span>Nights</span><strong>${stay.nights}</strong></div>
      <div><span>${currency.format(room.price)} per night</span><strong>${currency.format(stay.subtotal)}</strong></div>
      <div><span>Taxes</span><strong>${currency.format(stay.taxes)}</strong></div>
      <div><span>Total to pay</span><strong>${currency.format(stay.total)}</strong></div>
    `;
  };
  byId("#checkIn").addEventListener("change", updateSummary);
  byId("#checkOut").addEventListener("change", updateSummary);
  updateSummary();

  byId("#bookingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const stay = calculateStay(room.price, byId("#checkIn").value, byId("#checkOut").value);
    if (stay.nights <= 0) {
      byId("#priceSummary").insertAdjacentHTML("beforeend", `<p class="error">Check-out must be after check-in.</p>`);
      return;
    }
    const payload = {
      customer: byId("#guestName").value.trim(),
      email: byId("#guestEmail").value.trim(),
      phone: byId("#guestPhone").value.trim(),
      guests: byId("#guestCount").value,
      checkIn: byId("#checkIn").value,
      checkOut: byId("#checkOut").value,
      hotel,
      room,
      stay
    };
    startPayment(payload);
  });
}

function startPayment(payload) {
  const transactionRef = `SE-TX-${Date.now()}`;
  const bookingReference = `SE-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const demoMode =
    !window.FlutterwaveCheckout ||
    FLUTTERWAVE_PUBLIC_KEY.includes("REPLACE_WITH_YOUR_KEY");

  if (demoMode) {
    completePayment(payload, {
      transaction_id: `DEMO-${Date.now()}`,
      tx_ref: transactionRef,
      status: "successful",
      booking_reference: bookingReference
    });
    return;
  }

  window.FlutterwaveCheckout({
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: transactionRef,
    amount: payload.stay.total,
    currency: "ZAR",
    payment_options: "card",
    meta: {
      booking_reference: bookingReference,
      room_id: payload.room.id,
      hotel_id: payload.hotel.id
    },
    customer: {
      email: payload.email,
      phone_number: payload.phone,
      name: payload.customer
    },
    customizations: {
      title: "StayEase Hotel Booking",
      description: `${payload.hotel.name} - ${payload.room.name}`,
      logo: ""
    },
    callback: (response) => {
      completePayment(payload, response);
    },
    onclose: () => {}
  });
}

function completePayment(payload, paymentResponse) {
  const reference =
    paymentResponse.booking_reference ||
    paymentResponse.meta?.booking_reference ||
    `SE-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const booking = {
    customer: payload.customer,
    email: payload.email,
    phone: payload.phone,
    reference,
    transactionId: String(paymentResponse.transaction_id || paymentResponse.tx_ref),
    hotelId: payload.hotel.id,
    roomId: payload.room.id,
    hotel: payload.hotel.name,
    room: payload.room.name,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    nights: payload.stay.nights,
    guests: payload.guests,
    status: "Confirmed",
    paymentStatus: "Paid",
    amount: payload.stay.total
  };

  bookings.unshift(booking);
  const found = findRoom(payload.room.id);
  if (found) found.room.status = "Fully booked";
  save();
  renderHotels();
  renderRooms();
  if (isAdminLoggedIn()) renderAdmin();

  modalContent.innerHTML = `
    <p class="eyebrow">Payment success</p>
    <h2>Booking confirmed</h2>
    <p class="muted">Backend production flow: webhook verifies payment, saves booking, marks room booked, generates QR code, then sends email.</p>
    ${qrPass(booking)}
  `;
}

function qrPass(booking) {
  return `
    <div class="qr-pass">
      <div class="qr-box">${Array.from({ length: 25 }).map(() => "<span></span>").join("")}</div>
      <strong>${booking.reference}</strong>
      <span>${booking.customer}</span>
      <span>${booking.hotel} | ${booking.room}</span>
      <span>${booking.checkIn} to ${booking.checkOut} | ${currency.format(booking.amount)}</span>
    </div>
  `;
}

function renderAdmin() {
  if (!isAdminLoggedIn()) return;

  const allRooms = hotels.flatMap((hotel) => hotel.rooms.map((room) => ({ hotel, room })));
  byId("#totalBookings").textContent = bookings.length;
  byId("#totalRevenue").textContent = currency.format(
    bookings.reduce((sum, booking) => sum + booking.amount, 0)
  );
  byId("#availableRooms").textContent = allRooms.filter((item) => item.room.status === "Available").length;
  byId("#bookingRows").innerHTML = bookings
    .map(
      (booking) => `
        <tr>
          <td>${booking.customer}<br><span class="table-sub">${booking.email}</span></td>
          <td>${booking.hotel}</td>
          <td>${booking.room}<br><span class="table-sub">${booking.checkIn} to ${booking.checkOut}</span></td>
          <td>${booking.status} / ${booking.paymentStatus}</td>
          <td>${currency.format(booking.amount)}</td>
          <td><button type="button" class="light-button" data-cancel="${booking.reference}">Cancel</button></td>
        </tr>
      `
    )
    .join("");

  const adminHost = byId("#adminControls");
  if (adminHost) {
    adminHost.innerHTML = `
      <div class="admin-grid">
        <form class="panel" id="hotelForm">
          <h3>Add Hotel</h3>
          <label><span>Hotel name</span><input id="adminHotelName" required /></label>
          <label><span>City</span><input id="adminHotelCity" required /></label>
          <label><span>Starting price</span><input id="adminHotelPrice" type="number" min="1" required /></label>
          <button type="submit">Save Hotel</button>
        </form>
        <form class="panel" id="roomForm">
          <h3>Add Room</h3>
          <label><span>Hotel</span><select id="adminRoomHotel">${hotels.map((hotel) => `<option value="${hotel.id}">${hotel.name}</option>`).join("")}</select></label>
          <label><span>Room name</span><input id="adminRoomName" required /></label>
          <label><span>Price per night</span><input id="adminRoomPrice" type="number" min="1" required /></label>
          <label><span>Image URL</span><input id="adminRoomImage" placeholder="https://..." required /></label>
          <button type="submit">Save Room</button>
        </form>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Hotel</th><th>Room</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${allRooms.map(({ hotel, room }) => `
              <tr>
                <td>${hotel.name}</td>
                <td>${room.name}</td>
                <td>${currency.format(room.price)}</td>
                <td>${room.status}</td>
                <td>
                  <select data-status="${room.id}">
                    ${["Available", "Fully booked", "Maintenance"].map((status) => `<option ${room.status === status ? "selected" : ""}>${status}</option>`).join("")}
                  </select>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    bindAdminForms();
  }

  document.querySelectorAll("[data-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      const booking = bookings.find((item) => item.reference === button.dataset.cancel);
      if (!booking) return;
      booking.status = "Cancelled";
      const found = findRoom(booking.roomId);
      if (found) found.room.status = "Available";
      save();
      renderHotels();
      renderRooms();
      renderAdmin();
    });
  });
}

function isAdminLoggedIn() {
  return localStorage.getItem("stayease:admin") === "true";
}

function setAdminView() {
  const loggedIn = isAdminLoggedIn();
  byId("#adminLoginPanel").hidden = loggedIn;
  byId("#adminDashboard").hidden = !loggedIn;
  byId("#adminLogout").hidden = !loggedIn;
  if (loggedIn) renderAdmin();
}

function bindAdminForms() {
  byId("#hotelForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = byId("#adminHotelName").value.trim();
    const city = byId("#adminHotelCity").value.trim();
    const price = Number(byId("#adminHotelPrice").value);
    hotels.push({
      id: `h-${Date.now()}`,
      name,
      city,
      rating: 4.5,
      priceFrom: price,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
      description: "New hotel added from the admin dashboard.",
      amenities: ["WiFi", "Parking"],
      rooms: []
    });
    save();
    renderHotels();
    renderAdmin();
  });

  byId("#roomForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const hotel = hotels.find((item) => item.id === byId("#adminRoomHotel").value);
    if (!hotel) return;
    const price = Number(byId("#adminRoomPrice").value);
    hotel.rooms.push({
      id: `r-${Date.now()}`,
      name: byId("#adminRoomName").value.trim(),
      price,
      capacity: 2,
      bed: "Queen bed",
      size: "32 sqm",
      status: "Available",
      images: [byId("#adminRoomImage").value.trim()],
      features: ["WiFi", "TV", "Hot shower"],
      details: "Room added from the admin dashboard."
    });
    hotel.priceFrom = Math.min(hotel.priceFrom, price);
    save();
    renderHotels();
    renderRooms();
    renderAdmin();
  });

  document.querySelectorAll("[data-status]").forEach((select) => {
    select.addEventListener("change", () => {
      const found = findRoom(select.dataset.status);
      if (!found) return;
      found.room.status = select.value;
      save();
      renderRooms();
      renderAdmin();
    });
  });
}

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeBookingModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

byId("#lookupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = byId("#lookupEmail").value.trim().toLowerCase();
  const reference = byId("#lookupReference").value.trim().toUpperCase();
  const booking = bookings.find(
    (item) => item.email.toLowerCase() === email && item.reference === reference
  );
  byId("#lookupResult").innerHTML = booking
    ? `${qrPass(booking)}`
    : "No booking found. Check the email and reference, then try again.";
});

byId("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = byId("#searchText").value.trim();
  if (query) {
    const match = hotels.find((hotel) => hotel.city.toLowerCase() === query.toLowerCase());
    cityFilter.value = match ? match.city : "all";
    renderHotels();
  }
  byId("#hotels").scrollIntoView({ behavior: "smooth" });
});

byId("#adminLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = byId("#adminEmail").value.trim().toLowerCase();
  const password = byId("#adminPassword").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("stayease:admin", "true");
    byId("#adminLoginError").textContent = "";
    setAdminView();
    return;
  }

  byId("#adminLoginError").textContent = "Invalid admin email or password.";
});

byId("#adminLogout").addEventListener("click", () => {
  localStorage.removeItem("stayease:admin");
  setAdminView();
});

cityFilter.addEventListener("change", renderHotels);
priceFilter.addEventListener("change", renderHotels);
closeModal.addEventListener("click", closeBookingModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeBookingModal();
});

renderHotels();
renderRooms();
setAdminView();
