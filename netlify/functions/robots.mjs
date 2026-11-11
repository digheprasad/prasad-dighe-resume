export default async function robots(request, context) {
  const siteUrl = context.site?.url || process.env.URL || new URL(request.url).origin;
  const origin = new URL(siteUrl).origin;
  const content = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
