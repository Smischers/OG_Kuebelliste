// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = 'Enter Client ID here';
const API_KEY = 'Enter API Key here';


// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('add_deadline_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click and call the callback function.
 */
function handleAuthClick(callback) {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }

    // Call the callback function after successful authentication
    if (callback) {
      callback();
    }
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
  }
}

async function addDeadlineToCalendar(name, deadline) {
  const [day, month, year] = deadline.split('.');
  const eventStartTime = new Date(year, month - 1, day);
  eventStartTime.setDate(eventStartTime.getDate() + 1); 
  const eventEndTime = new Date(year, month - 1, day);
  eventEndTime.setDate(eventEndTime.getDate() + 1); // All-day events end the next day

  // Set the time zone to Vienna
  const timeZone = 'Europe/Vienna';

  let event = {
    'summary': name,
    'start': {
      'date': eventStartTime.toISOString().split('T')[0],
      'timeZone': timeZone
    },
    'end': {
      'date': eventEndTime.toISOString().split('T')[0],
      'timeZone': timeZone
    },
    'colorId': 1,
  };

  // Creates a request object to insert a new event
  const request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
  });

}

// Attach the functions to the global scope
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;
//window.handleSignoutClick = handleSignoutClick;
window.addDeadlineToCalendar = addDeadlineToCalendar;

//document.getElementById('signout_button').addEventListener('click', handleSignoutClick);


function onCalendarButtonClick(name, date){
  handleAuthClick(() => addDeadlineToCalendar(name, date));
}