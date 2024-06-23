// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '342392638281-r894jq075b0ntuocar2vgibp8s5drrdd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBy5tRJPBRMfHAjdIrZr57Erpn4bli44Bo';


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
  maybeEnableButtons();
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
  // Parse the input date string
  const [day, month, year] = deadline.split('.');
  const eventStartTime = new Date(year, month - 1, day, 0, 0, 0);
  // Set the time zone to Vienna
  const timeZone = 'Europe/Vienna';

  // Create an event end time 45 minutes after the start time
  const eventEndTime = new Date(eventStartTime);
  eventEndTime.setHours(eventEndTime.getMinutes() + 23);
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 59);

  let event = {
    'summary': name,
    'start': {
      'dateTime': eventStartTime,
      'timeZone': timeZone
    },
    'end': {
      'dateTime': eventEndTime,
      'timeZone': timeZone
    },
    'colorId': 1,
  };
  
  //Creates a request Object to insert a new event
  const request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    appendPre('Event created: ' + event.htmlLink);
  });
  
  // Function to append text to a preformatted text block on the page
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  } 
}

// Attach the functions to the global scope
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;
//window.handleSignoutClick = handleSignoutClick;
window.addDeadlineToCalendar = addDeadlineToCalendar;

//document.getElementById('signout_button').addEventListener('click', handleSignoutClick);

// Handle Authorisation and Add event listener to the button
document.getElementById('add_deadline_button').addEventListener('click', function() {
  handleAuthClick(() => addDeadlineToCalendar('Test', '24.06.2024'));
});