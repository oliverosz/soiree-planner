const GUEST_CAP = 120;

const DIET_OPTIONS = [
  { value: "none", label: "None" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
];

const guests = [
  { name: "Mara Voss", status: "Attending", plusOne: "Leo", diet: "vegetarian" },
  { name: "Julian Price", status: "Attending", plusOne: "None", diet: "none" },
  { name: "Nina Bell", status: "Pending", plusOne: "Maybe", diet: "gluten-free" },
  { name: "Theo Hart", status: "Attending", plusOne: "Sam", diet: "none" },
  { name: "Iris Lane", status: "Regrets", plusOne: "None", diet: "vegan" },
  { name: "Camille Stone", status: "Attending", plusOne: "Ari", diet: "gluten-free" },
];

const waitlist = [];

const drinks = [
  {
    night: "Night One",
    name: "Apricot Sundown Spritz",
    details: "Aperol, apricot nectar, prosecco, soda, and orange peel.",
  },
  {
    night: "Night Two",
    name: "Garden Glow Collins",
    details: "Gin, lemon, basil syrup, cucumber, and sparkling water.",
  },
  {
    night: "Night Three",
    name: "Moonlit Peach Fizz",
    details: "Bourbon, peach, honey, ginger beer, and fresh mint.",
  },
];

const openingGoldenHour = new Date("2026-07-18T19:45:00+02:00");

function statusClass(status) {
  return status.toLowerCase();
}

function dietLabel(diet) {
  return DIET_OPTIONS.find((option) => option.value === diet)?.label ?? "None";
}

function partySize(guest) {
  return guest.status === "Attending" && guest.plusOne !== "None" ? 2 : 1;
}

function confirmedGuestCount() {
  return guests
    .filter((guest) => guest.status === "Attending")
    .reduce((total, guest) => total + partySize(guest), 0);
}

function spotsRemaining() {
  return Math.max(GUEST_CAP - confirmedGuestCount(), 0);
}

function renderCapacity() {
  document.querySelector("#spots-remaining").textContent = spotsRemaining();
  document.querySelector("#guest-cap").textContent = GUEST_CAP;
}

function renderDietSummary() {
  const dietSummary = document.querySelector("#diet-summary");
  const counts = DIET_OPTIONS.reduce((totals, option) => {
    totals[option.value] = 0;
    return totals;
  }, {});

  guests
    .filter((guest) => guest.status === "Attending")
    .forEach((guest) => {
      counts[guest.diet] += 1;
    });

  dietSummary.innerHTML = DIET_OPTIONS.map(
    (option) => `
      <div class="diet-summary-item">
        <span class="diet-badge diet-${option.value}">${option.label}</span>
        <strong>${counts[option.value]}</strong>
      </div>
    `,
  ).join("");
}

function guestCard(guest) {
  return `
    <article class="guest-card">
      <div>
        <p class="guest-name">${guest.name}</p>
        <p class="guest-plus-one">Plus-one: ${guest.plusOne}</p>
      </div>
      <div class="guest-badges">
        <span class="diet-badge diet-${guest.diet}">${dietLabel(guest.diet)}</span>
        <span class="status ${statusClass(guest.status)}">${guest.status}</span>
      </div>
    </article>
  `;
}

function renderGuests() {
  const guestList = document.querySelector("#guest-list");
  const waitlistSection = document.querySelector("#waitlist-section");
  const waitlistList = document.querySelector("#waitlist-list");

  guestList.innerHTML = guests.map(guestCard).join("");
  waitlistList.innerHTML = waitlist.map(guestCard).join("");
  waitlistSection.hidden = waitlist.length === 0;
  renderCapacity();
  renderDietSummary();
}

function renderDrinks() {
  const drinkMenu = document.querySelector("#drink-menu");

  drinkMenu.innerHTML = drinks
    .map(
      (drink) => `
        <article class="drink-card">
          <p class="drink-night">${drink.night}</p>
          <p class="drink-name">${drink.name}</p>
          <p class="drink-details">${drink.details}</p>
        </article>
      `,
    )
    .join("");
}

function addRsvp(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const name = form.elements["guest-name"].value.trim();
  const status = form.elements["rsvp-status"].value;
  const plusOne = form.elements["plus-one"].value.trim() || "None";
  const diet = form.elements["dietary-preference"].value;

  if (!name) {
    return;
  }

  const guest = { name, status, plusOne, diet };

  if (status === "Attending" && partySize(guest) > spotsRemaining()) {
    waitlist.push({ ...guest, status: "Waitlisted" });
  } else {
    guests.unshift(guest);
  }

  renderGuests();
  form.reset();
  form.elements["rsvp-status"][0].checked = true;
  form.elements["guest-name"].focus();
}

function updateCountdown() {
  const now = new Date();
  const remaining = Math.max(openingGoldenHour - now, 0);
  const secondsTotal = Math.floor(remaining / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  document.querySelector("#days").textContent = days;
  document.querySelector("#hours").textContent = hours;
  document.querySelector("#minutes").textContent = minutes;
  document.querySelector("#seconds").textContent = seconds;
  document.querySelector("#countdown-note").textContent =
    remaining > 0
      ? "Golden hour begins July 18, 2026 at 7:45 PM."
      : "Golden hour has arrived. Time to light the candles.";
}

document.querySelector("#rsvp-form").addEventListener("submit", addRsvp);
renderGuests();
renderDrinks();
updateCountdown();
setInterval(updateCountdown, 1000);
