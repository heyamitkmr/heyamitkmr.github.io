---
layout: default
title: "All posts"
permalink: /writing/
---

## **Latest writings**

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      {%- if post.external_url -%}
        <!-- For external posts, link to the local post page first -->
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
