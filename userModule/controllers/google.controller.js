import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';

import { GoogleAuth } from 'google-auth-library';
// Download your OAuth2 configuration from the Google

// An import assertion in a dynamic import
const {default:keys} = await import("../cliente/clientegoogle.json", {
  assert: {
    type: "json",
  },
});
// create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
// which should be downloaded from the Google Developers Console.
const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
);
/**
* Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
* this library will automatically choose the right client based on the environment.
*/
async function main() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({ url });
  console.log(res.data);
}

//main().catch(console.error);

/**
 * TODO(developer):
 *  1. Uncomment and replace these variables before running the sample.
 *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
 *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
 *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
 */
 const projectId = keys.web.project_id;

import { Storage } from '@google-cloud/storage';

async function authenticateImplicitWithAdc() {
  // This snippet demonstrates how to list buckets.
  // NOTE: Replace the client created below with the client required for your application.
  // Note that the credentials are not specified when constructing the client.
  // The client library finds your credentials using ADC.
  const storage = new Storage({
    projectId,
  });
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:',buckets);

  for (const bucket of buckets) {
    console.log(`- ${bucket.name}`);
  }

  console.log('Listed all storage buckets.');
}

authenticateImplicitWithAdc().catch(console.error);


/**
* Start by acquiring a pre-authenticated oAuth2 client.
*/
async function main2() {
  const oAuth2Client = await getAuthenticatedClient();
  // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
  const res = await oAuth2Client.request({url});
  console.log(res.data);

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log(tokenInfo);
}

/**
* Create a new OAuth2Client, and go through the OAuth2 content
* workflow.  Return the full client to the callback.
*/
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          console.log(req);
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    
    destroyer(server);
  });
}

async function tokens() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();

  client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  const projectId = await auth.getProjectId();
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({ url });

  console.log(res.data);
}

async function save(code) {
  // Obtener tokens de acceso y de actualización
  const tokens = await oAuth2Client.getToken(code);
  // Guardar los tokens en el cliente OAuth2
  oAuth2Client.setCredentials(tokens);
}
async function newtoken() {
  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    // To get a refresh token, you MUST set access_type to `offline`.
    access_type: 'offline',
    // set the appropriate scopes
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
    // A refresh token is only returned the first time the user
    // consents to providing access.  For illustration purposes,
    // setting the prompt to 'consent' will force this consent
    // every time, forcing a refresh_token to be returned.
    prompt: 'consent'
  });
}
async function verificar(token) {
  // after acquiring an oAuth2Client...
  const tokenInfo = await oAuth2Client.getTokenInfo(token);

  // take a look at the scopes originally provisioned for the access token
  console.log(tokenInfo.scopes);
  return tokenInfo.scopes;
}
export {
  main,
  main2,
  tokens,
  save,
  newtoken,
  verificar
};