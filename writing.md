---
layout: default
title: "All posts"
permalink: /writing/
---

<div class="followit--follow-form-container" style="max-width: 400px; margin: 20px auto;" attr-a attr-b attr-c attr-d attr-e attr-f>
    <form data-v-2164b4a9="" action="https://api.follow.it/subscription-form/Y1AvMENUNkxuL3gzekNmTmVidjBLYWNoOERZb25kaDM5a01nd0lsV09MUUx4NXpJQnVvbU52S3dmRWUrTTVZaE8xcXp6WkJZTi91MDFSZjU2aWwvT2tzVnZrb0VueUcrU1pVY2tCU01mVWVVcm5WOEovR1cxeldkUFZsbzVRVFp8dFBqenFiUWVyNk9jektndWZReUNxbDd3M1M2ejN5dWVOWmQrdmVuYmcwTT0=/8" method="post"><div data-v-2164b4a9="" class="form-preview" style="background-color: var(--bg-secondary); position: relative;"><div data-v-2164b4a9="" class="preview-heading"><h5 data-v-2164b4a9="" style="font-family: Helvetica; font-weight: 300; color: var(--text-color); font-size: 14px; text-align: center; text-transform: none !important;">Subscribe to get future posts via email</h5></div><div data-v-2164b4a9="" class="preview-input-field"><input data-v-2164b4a9="" type="email" name="email" required="" placeholder="Type your email ..." spellcheck="false" style="font-family: Helvetica; font-weight: 400; color: rgb(82, 93, 97); font-size: 14px; text-align: center; background-color: rgb(250, 249, 244); text-transform: none !important;"></div><div data-v-2164b4a9="" class="preview-submit-button"><button data-v-2164b4a9="" type="submit" style="font-family: Arial; font-weight: bold; color: rgba(0,0,0, 1); font-size: 14px; text-align: center; background-color: var(--nav-link-color); text-transform: none !important;">Subscribe</button></div></div></form>
</div>


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
