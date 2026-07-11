const guests = [
  { name: "Mara Voss", status: "Attending", plusOne: "Leo" },
  { name: "Julian Price", status: "Attending", plusOne: "None" },
  { name: "Nina Bell", status: "Pending", plusOne: "Maybe" },
  { name: "Theo Hart", status: "Attending", plusOne: "Sam" },
  { name: "Iris Lane", status: "Regrets", plusOne: "None" },
  { name: "Camille Stone", status: "Attending", plusOne: "Ari" },
];

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

function renderGuests() {
  const guestList = document.querySelector("#guest-list");

  guestList.innerHTML = guests
    .map(
      (guest) => `
        <article class="guest-card">
          <div>
            <p class="guest-name">${guest.name}</p>
            <p class="guest-plus-one">Plus-one: ${guest.plusOne}</p>
          </div>
          <span class="status ${statusClass(guest.status)}">${guest.status}</span>
        </article>
      `,
    )
    .join("");
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

  if (!name) {
    return;
  }

  guests.unshift({ name, status, plusOne });
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
