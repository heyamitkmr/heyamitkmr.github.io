---
layout: bit
title: "Bits. Of this and that."
permalink: /bits/
---

## Bits

<em> If you like something, hate something, you know where to reach me. Check out the About page.</em>

<ul class="post-list">
  {% for post in site.categories.bits %}
    <li>
      <a href="{{ post.url | relative_url }}" class="post-card">
        <div class="post-card-header">
          <h3>{{ post.title }}</h3>
          <span class="post-card-date">{{ post.date | date: "%b %-d, %Y" }}</span>
        </div>
        
        <p class="post-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
        
        <div class="post-card-footer">
          <span class="post-card-meta">{{ post.content | number_of_words }} words</span>
          <span class="read-more">Read more</span>
        </div>
      </a>
    </li>
  {% endfor %}
</ul>
