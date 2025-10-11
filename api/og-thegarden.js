export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  
  // Only handle /thegarden route
  if (!url.pathname.includes('/thegarden')) {
    return fetch(request);
  }

  // Fetch the original HTML
  const response = await fetch(request);
  let html = await response.text();

  // Replace the default og:image and twitter:image with Jules Thumbnail
  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/g,
    '<meta property="og:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />'
  );
  
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/g,
    '<meta name="twitter:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />'
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html',
      'cache-control': response.headers.get('cache-control') || 'public, max-age=0, must-revalidate'
    }
  });
}

