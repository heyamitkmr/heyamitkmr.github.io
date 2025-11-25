---
layout: default
title: "Thoughts"
permalink: /thoughts/
---

## Thoughts
On software, design, and simplicity and whatever else is on my mind.

<ul class="post-list">
  {% for post in site.categories.blog %}
    <li>
      {%- if post.external_url -%}
        <!-- For external posts, link to the local post page first (not directly to external_url) -->
        <a href="{{ post.url | relative_url }}" class="post-card external-link">
      {%- else -%}
        <a href="{{ post.url | relative_url }}" class="post-card">
      {%- endif -%}
        
        <div class="post-card-header">
          <h3>{{ post.title }}</h3>
          <span class="post-card-date">{{ post.date | date: "%b %-d, %Y" }}</span>
        </div>
        
        <p class="post-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
        
        <div class="post-card-footer">
          <span class="post-card-meta">
            {%- if post.external_url -%}
              External Link
            {%- else -%}
              {{ post.content | number_of_words }} words
            {%- endif -%}
          </span>
          <span class="read-more">Read more</span>
        </div>
        
      </a>
    </li>
  {% endfor %}
</ul>
