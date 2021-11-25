<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($data as $id =>$d)
        <sitemap>
            <loc>{{ request()->root().'/sitemap/'.$id.'.xml' }}</loc>
            <lastmod>{{ $d['updated_at'] }}</lastmod>
        </sitemap>
    @endforeach
</sitemapindex>