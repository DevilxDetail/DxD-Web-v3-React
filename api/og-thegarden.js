export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  
  // Fetch index.html directly to avoid infinite loop
  const baseUrl = url.origin + '/index.html';
  const response = await fetch(baseUrl);
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
      'cache-control': 'public, max-age=0, must-revalidate'
    }
  });
}

