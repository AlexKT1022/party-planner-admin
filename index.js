// === Constants ===
const BASE = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api';
const COHORT = '/2507-ftb-et-web-ft'; // Make sure to change this!
const API = BASE + COHORT;
const initialParties = [
  {
    id: 14008,
    name: 'optimize sticky deliverables',
    description:
      'Exercitationem vero maxime exercitationem excepturi pariatur dolores tempore. Quasi quo expedita eaque facere adipisci enim. Nisi aspernatur fugit quis molestias explicabo enim accusamus beatae recusandae.',
    date: '2023-08-20T23:40:08.000Z',
    location: '75141 Ziemann Throughway',
    cohortId: 6307,
  },
  {
    id: 14009,
    name: 'unleash extensible systems',
    description:
      'Ullam doloribus ut tempora cumque aliquam dignissimos numquam voluptatum. Similique aut dolore cumque similique adipisci a exercitationem facilis. Harum tempora praesentium laborum optio voluptatem.',
    date: '2024-01-07T12:20:44.000Z',
    location: '41353 Koss Key',
    cohortId: 6307,
  },
  {
    id: 14010,
    name: 'harness synergistic e-commerce',
    description:
      'Ducimus sapiente architecto cumque eius. Dolore nihil excepturi voluptatibus asperiores eos minima. Quasi maxime libero deleniti vel atque cumque quis.',
    date: '2023-09-04T20:09:22.000Z',
    location: "87072 O'Keefe Wells",
    cohortId: 6307,
  },
  {
    id: 14011,
    name: 'aggregate customized partnerships',
    description:
      'Impedit asperiores placeat facilis quas esse repellat nam dicta ullam. Quam ipsa quis esse ipsam occaecati. Consectetur esse cumque atque veritatis eius delectus repellat.',
    date: '2023-11-13T07:00:24.000Z',
    location: '427 Freda Parkways',
    cohortId: 6307,
  },
  {
    id: 14012,
    name: 'facilitate strategic platforms',
    description:
      'Perspiciatis maxime voluptate sit mollitia nobis. Reiciendis quibusdam inventore cupiditate ratione. Eius itaque rerum ea nihil.',
    date: '2023-07-23T20:18:02.000Z',
    location: '2660 Everardo Forges',
    cohortId: 6307,
  },
];

// === State ===
let parties = [];
let selectedParty;
let rsvps = [];
let guests = [];

/** Updates state with all parties from the API */
const getParties = async () => {
  try {
    const response = await fetch(API + '/events');
    const result = await response.json();
    parties = result.data;
    render();
  } catch (err) {
    console.error(err);
  }
};

/** Updates state with a single party from the API */
const getParty = async (id) => {
  try {
    const response = await fetch(API + '/events/' + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (err) {
    console.error(err);
  }
};

/** Updates state with all RSVPs from the API */
const getRsvps = async () => {
  try {
    const response = await fetch(API + '/rsvps');
    const result = await response.json();
    rsvps = result.data;

    render();
  } catch (err) {
    console.error(err);
  }
};

/** Updates state with all guests from the API */
const getGuests = async () => {
  try {
    const response = await fetch(API + '/guests');
    const result = await response.json();
    guests = result.data;

    render();
  } catch (err) {
    console.error(err);
  }
};

/** */
const createParty = async (partyObj) => {
  const res = await fetch(API + '/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partyObj),
  });
  const data = await res.json();

  await getParties();

  return data;
};

/** */
const deleteParty = async (id) => {
  await fetch(API + `/events/${id}`, {
    method: 'DELETE',
  });

  resetSelectedParty();
  getParties();
};

/** */
const resetAPI = async () => {};

/** Resets selectedParty state to undefined */
const resetSelectedParty = () => {
  selectedParty = undefined;

  render();
};

// === Components ===
/** Party name that shows more details about the party when clicked */
const PartyListItem = (party) => {
  const $li = document.createElement('li');

  if (party.id === selectedParty?.id) {
    $li.classList.add('selected');
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener('click', () => getParty(party.id));

  return $li;
};

/** A list of names of all parties */
const PartyList = () => {
  const $ul = document.createElement('ul');
  $ul.classList.add('parties');

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
};

/** Detailed information about the selected party */
const SelectedParty = () => {
  if (!selectedParty) {
    const $p = document.createElement('p');
    $p.textContent = 'Please select a party to learn more.';

    return $p;
  }

  const $party = document.createElement('section');
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
    <DeleteButton></DeleteButton>
    <BackButton></BackButton>
  `;

  $party.querySelector('GuestList').replaceWith(GuestList());
  $party.querySelector('DeleteButton').replaceWith(DeleteButton());
  $party.querySelector('BackButton').replaceWith(BackButton());

  return $party;
};

/** List of guests attending the selected party */
const GuestList = () => {
  const $ul = document.createElement('ul');
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
    )
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement('li');
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
};

/** Form to add a new party */
const NewPartyForm = () => {
  const $newPartyForm = document.createElement('form');
  $newPartyForm.innerHTML = `
  <label>
    Name
    <input name="name" type="text" required></input>
  </label>
  <label>
    Description
    <input name="description" type="text" required></input>
  </label>
  <label>
    Date
    <input name="date" type="date" required></input>
  </label>
  <label>
    Location
    <input name="location" type="text" required></input>
  </label>
  <input type="submit"></input>
  `;

  $newPartyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const partyObj = {
      name: e.target.name.value,
      description: e.target.description.value,
      date: new Date(e.target.date.value).toISOString(),
      location: e.target.location.value,
    };

    createParty(partyObj);
  });

  return $newPartyForm;
};

/** Button to reset selectedParty state variable */
const BackButton = () => {
  const $backButton = document.createElement('button');
  $backButton.innerText = 'Back';

  $backButton.addEventListener('click', resetSelectedParty);

  return $backButton;
};

/** Button to delete selected party */
const DeleteButton = () => {
  const $deleteButton = document.createElement('button');
  $deleteButton.innerText = 'Delete Event';

  $deleteButton.addEventListener('click', () => deleteParty(selectedParty.id));

  return $deleteButton;
};

/** Button to reset API */
const ResetParties = () => {
  const $resetParties = document.createElement('button');
  $resetParties.innerText = 'Reset Parties';

  $resetParties.addEventListener('click', () => console.log(initialParties));

  return $resetParties;
};

// === Render ===
const render = () => {
  const $app = document.querySelector('#app');
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <h3>Create a New Party</h3>
        <NewPartyForm></NewPartyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
      <ResetParties></ResetParties>
    </main>
  `;

  $app.querySelector('PartyList').replaceWith(PartyList());
  $app.querySelector('SelectedParty').replaceWith(SelectedParty());
  $app.querySelector('NewPartyForm').replaceWith(NewPartyForm());
  $app.querySelector('ResetParties').replaceWith(ResetParties());
};

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();

  render();
}

init();
