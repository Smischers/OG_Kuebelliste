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

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

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
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    //await listUpcomingEvents();
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
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}



async function addDeadlineToCalendar() {

  const dataModelEntry = dataModel.List1.Header1.Entry1;

  const eventStartTime = new Date();

  // Start time for the day after tomorrow
  eventStartTime.setDate(eventStartTime.getDate() + 2);

  const eventEndTime = new Date(eventStartTime);
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

let event = {
  'summary': 'TestTitle',
  'location': 'Favoritenstraße 226, 1100 Wien, Österreich',
  'description': dataModelEntry.Description,
  'start': {
    'dateTime': eventStartTime.toISOString(),
    'timeZone': 'Europe/Vienna'
  },
  'end': {
    'dateTime': eventEndTime.toISOString(),
    'timeZone': 'Europe/Vienna'
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


