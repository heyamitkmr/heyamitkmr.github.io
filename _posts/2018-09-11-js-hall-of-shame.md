---
title: "Javascript and graceful failure paradigm"
excerpt: "Thoughts about implicit assumption of availability of Javascript support by most web-developers"
date: 2018-09-11
category: blog
tags: [javascript, opinion, nextfive]
---


*_TO DO_* *1. Check term accuracy: defensive programming, etc* *2.
Link to standard definitions* *3. Edit the prose*

`<rant>`
I had just filled up the form halfway when the "Country/State"
drop-downs came up. Only trouble, there were no options to select. "No
worries" - I thought, the field does not seem to be mandatory anyway
(no asterisk mark or other equivalent visual indication).

Trudging through the remaining fields of the form - leaving another few
of the optional ones blank - I completed the form and click "Submit".
And nothing happens.

Of course, I click it a couple more times understanding full well the
stupidity of my repetitive clicks. May be just in frustration. Another
case of *ungraceful failure*. I check the Firefox console and sure
enough, seems like some JS failure on submission.

I go on and enable some of the JS on the page and get some of the
drop-down fields to start accepting text values. But of course, couple
of minutes later it's the same story - "Location has to be selected
from the list of options". So, then I go on enable a few more scripts
on the page so that the fields can make AJAX calls to populate the said
options and allow me to choose from them.

And so it goes on for a good 15 minutes. A frustrating, draining and all
too common situation these days. The page was a recruitment funnel for
one of the clients of GreenHouse.Io - a recruitment services provider
who apparently provide an "amazing applicant experience".

`</rant>`


I started out thinking this is over-reliance on JavaScript. But the
longer I think about it, the more strongly I believe it's not JS
reliance which is the problem. It's the lazy programming. ***The
implicit assumption that every single soul on the internet is allowing
any random JS to run willy-nilly on the device she is using.***

Armed with this erroneous assumption, the developers don't even think
about defensive programming or graceful failure patterns with respect to
JS dependence. Just how difficult it is to do a on-load check to see if
the browser has JS support enabled? Of course, a good service/product
will work around this limitation (think Gmail). But at the very least, a
developer can warn the end users about JS requirement and declare that
certain parts of the page may not work correctly without JS.

I have compiled below a list of websites with such lazy programming.\
This is going to be a running list which I will keep updating based on
my time / interest - as and when I encounter more of such pages:

    1. Greenhouse.io
    2. Icicibank.com - especially their dashboard page
    3. Google re-captcha implementation
