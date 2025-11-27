---
layout: default
title: "Amit @NextFive"
---

## Hi, I'm Amit!
I'm building software and writing while exploring what's next.

### **Me in 10 seconds**

I build [small useful software](https://blog.nextfive.in/products/) that runs in your browser. Free. Private. No login.<br>
I write about [building, learning, and momentum](https://earlynotes.substack.com/) and a bunch of [other stuff](https://world.hey.com/akumar).<br>
I take [photos](https://www.flickr.com/photos/proxygeek/).<br>

<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/27622262437/" title="20180505-DSC_3361.jpg"><img src="https://live.staticflickr.com/1745/27622262437_d9d213565b_t.jpg" width="100" height="66" alt="20180505-DSC_3361.jpg"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/39673705112/" title=":)"><img src="https://live.staticflickr.com/4718/39673705112_d2ab3cbeff_t.jpg" width="100" height="66" alt=":)"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/37267093181/" title="The divide"><img src="https://live.staticflickr.com/4343/37267093181_9f85808410_t.jpg" width="66" height="100" alt="The divide"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/54673232917/" title="D7K_6078_grey_small"><img src="https://live.staticflickr.com/65535/54673232917_118b0bcf91_t.jpg" width="66" height="100" alt="D7K_6078_grey_small"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/54674305334/" title="D7K_1749-01_small"><img src="https://live.staticflickr.com/65535/54674305334_25806d5292_t.jpg" width="100" height="66" alt="D7K_1749-01_small"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
<a data-flickr-embed="true" href="https://www.flickr.com/photos/proxygeek/37134786293/" title="Dussehra festival - Ravan Effigy burning"><img src="https://live.staticflickr.com/4464/37134786293_64774b8fd1_t.jpg" width="100" height="67" alt="Dussehra festival - Ravan Effigy burning"/></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


_[Me in 10 minutes](/about)? See [my "about" page](/about)._

_[What am I doing now](/now)? See [my "now" page](/now)._

---

### **Contact me**

I love meeting people working on interesting things. Email me.  I use Google's popular free email. And my ID is "hey```my-first-name-here```kmr".
<br><br>
Or let's [schedule some time](https://cal.com/amitkumar) on my calendar.

---

### **Recent projects**

**[Guide](https://blog.nextfive.in/products/)** (Nov 2025)  
A complete system to manage goals, tasks, and thinking. Built for myself, shared for you.

**[Web-Highlighter](https://blog.nextfive.in/products/)** (Jul 2025)  
Save ideas and quotes from any webpage with your notes. Stop losing good stuff.

---

### **Photography projects**

**[PictureThis](https://www.picturethis.in/)**  
Democratizing photography as art. No gatekeepers. Starting with Bengaluru.

**[ThePhotos.Org](https://thephotos.org/)**  
Prints, frames, galleries, exhibitions. Everything photo-related.

**[My Flickr](https://www.flickr.com/photos/proxygeek/)**  
Personal photostream. Everyday moments.

---

### **[Writing]((https://world.hey.com/akumar))**

#### Recent Posts ([see all](https://world.hey.com/akumar))

<ul class="post-list">
  {% for post in site.posts limit:3 %}
    <li>
      {%- if post.external_url -%}
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

