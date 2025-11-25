---
layout: post
title: "Publish script - a shell script to create your own static site"
date: 2018-10-09
category: project
tags: [projects, organization, static site, GitHub, shell script, Expose, Hyde, nextfive]
excerpt: "A shell script I cobbled together to create a static website with navigation based on folder structure of your posts - same as this site."
---

What is this
------------

A shell script I cobbled together to create a static website with
navigation based on folder structure of your posts. This website is
generated using the same script.

The html is created on a lightly modified version of
[Expose](https://github.com/Jack000/Expose) - a wonderful bash script by
[Jack Qiao](http://jack.works/) Theme is based off
[Hyde](https://github.com/poole/hyde) but you can change it easily by
just replacing the theme directory.

It's current state is essentially a template of how *NOT* to write a
shell script.
The mess is my own fault but I will keep improving it whenever I can.
In the mean time, it works! Sort of\...

More details on [this
post](https://proxygeek.github.io/about/this-blog.html)

Code available on [Github page](https://github.com/proxygeek/publish/)

How does it work
----------------

**Things it needs:**
1. A theme folder essentially containing some css/images/html templates
as needed
2. [Markdown script](https://daringfireball.net/projects/markdown/) and
[Perl](https://www.perl.org/get.html): *Optional* Only if you need
markdown support
3. A folder of your own writing
- Your-Folder
- SubFolder-1
- post*1.txt
- post*2.md
- SubFolder-2
- another_post.md
- SubFolder-3
....
- SubFolder-n

Just run the script in ***Your-Folder*** and it will generate a static
website under ***Your-Folder/*_site/** directory. The subdirectories
will be treated as different sections of the website and navigation will
be generated accordingly. Empty directories will be ignored.

Current issues
--------------

-   Refactor the code to remove redundant logic and restructure for
    clarity
-   Fix post tag search / links , especially in case of multiple tags
    for a post
-   Generate section level tag cloud from individual post tags:
    dir*tag*cloud
-   Number of (and links to) top posts to be read from config file in
    the top directory
-   Pick up related posts from YAML. say related\_posts:post1,post2
-   Sort command changes made to process the files / dirs in the order
    of most recent updates causes an additional directory to be created
    under _site directory
    -   Can be easily fixed by using the alphabetical sort instead -
        currently commented out
-   *And many, many more but none that should stop you from giving this
    a whirl* :)
