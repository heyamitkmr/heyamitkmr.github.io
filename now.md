---
layout: default
title: "What am I doing Now"
permalink: /now/
---
{% comment %}
  Don't edit the content here. To post an update, add a new file to _now/
  named YYYYMMDD.md (copy the latest one, and set its `date:`).
  This page always shows the newest entry; older ones stay at /archive/nowYYYYMMDD,
  each linking to the one before it.
{% endcomment %}
{% assign entries = site.now | sort: "date" %}
{% assign latest = entries | last %}
{{ latest.content }}

{% include now-prev.html entry=latest %}
