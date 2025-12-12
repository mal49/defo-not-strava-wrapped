export async function onRequestGet(context) {
  const { request, env } = context;
  
  // Get the origin from the request to build the redirect URI dynamically
  const url = new URL(request.url);
  const origin = url.origin;
  const redirectUri = `${origin}/callback`;
  
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${env.STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read,activity:read_all`;
  
  return new Response(JSON.stringify({ url: authUrl }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

