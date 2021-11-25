<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($data as $d)
    <url>
        <loc>{{ request()->root().'/'.$d['sitemap_url'].$d['sitemap_parameter'] }}</loc>
        <lastmod>{{ $d['updated_at'] }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    @endforeach
</urlset>