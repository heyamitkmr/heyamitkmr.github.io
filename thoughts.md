---
layout: default
title: "Thoughts"
permalink: /thoughts/
---

<div class="newsletter-container">
  <p style="font-size: 14px; text-align: center; margin-bottom: 10px;">Subscribe to get future posts via email (or grab the <a href="/feed.xml">RSS feed</a>)</p>
  
  <form data-v-2164b4a9="" action="https://api.follow.it/subscription-form/Y1AvMENUNkxuL3gzekNmTmVidjBLYWNoOERZb25kaDM5a01nd0lsV09MUUx4NXpJQnVvbU52S3dmRWUrTTVZaE8xcXp6WkJZTi91MDFSZjU2aWwvT2tzVnZrb0VueUcrU1pVY2tCU01mVWVVcm5WOEovR1cxeldkUFZsbzVRVFp8dFBqenFiUWVyNk9jektndWZReUNxbDd3M1M2ejN5dWVOWmQrdmVuYmcwTT0=/8" method="post">
    <div data-v-2164b4a9="" class="input-group">
      <input data-v-2164b4a9="" type="email" name="email" placeholder="Type your email..." required="" spellcheck="false">
      <button data-v-2164b4a9="" type="submit">Subscribe</button>
    </div>
  </form>
</div>


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
