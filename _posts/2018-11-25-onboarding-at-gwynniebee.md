---
layout: post
title: "On-boarding and user workflow - Gwynnie Bee"
date: 2018-11-25
category: project
tags: [opinions, product-management, on-boarding, user-journey, projects, nextfive]
excerpt: "A brief case study of user on-boarding at GwynnieBee - a clothing rental service for women. Also, some thoughts on relationship between on-boarding and user-workflow"
---

Recently I got to work on improving the user on-boarding experience for
Gwynnie Bee (Gbee) through its mobile app.\
Here\'s a brief summary of my experience and learnings.

-   **Disambiguation for terms used below**
    -   *User journey:* The entire experience journey of your user -
        from the realization of the need to exiting your service
    -   *User workflow:* The different paths a user can take in the app
        / website\
        (for example, 2 possible paths for an Amazon user could be
        login-\>search for chocolate-\>place order vs search for
        chocolate -\> add-to-cart-\>login-\>place order)
    -   *Service/product/user funnel:* Essentially, the different
        logical stages of commitment by your user\
        (For example, downloading of app, activation registration,
        transaction)

Why do we even bother about on-boarding
=======================================

Before even approaching the problem, it\'s handy to take a step back and
see what is user on-boarding all about.\
Not in some technical / management jargon but just trying to keep the
larger picture in mind.

**On-boarding from a user\'s perspective**\
- Why : To help me use the app better - When: Whenever I need help;
which is usually at the beginning - How : Just show me what and how and
I will take care of myself

**On-boarding from a product manager\'s perspective**\
- Why : To improve user activation, adoption & retention - When:
Throughout the customer life-cycle, as required - How : Focus on
removing the hurdles in the way of user using the service

Success metrics for on-boarding process
=======================================

The big picture view is fine to keep on track. But how would you really
*know* even if you had the best on-boarding flow possible?

**Decide what you are optimizing for** - User activity : Current active
users (absolute numbers as well as percentages) - User Engagement :
Number and percentages of users by - Different stages of the service
discovery funnel (e.g. install / first launch or activation / discovery
/ registration / billing) - Session length in different features - By
frequency of usage - By work-flow right before un-install - Other such
metrics, as needed

**Take baseline measurements of decided metrics and compare regularly
after implementing the new on-boarding flow**

An aside about relationship between on-boarding and app workflow
================================================================

A good on-boarding process should maximize the chances of users
progressing through the funnel leading up to the final goals.\
But sometimes, the goals set by the product team differs from that of
the users.

For example, if the product team wants to maximize user registrations,
they may put up a mandatory registration screen right at the beginning
of the workflow. But more often than not, a user would want to look
around to get a clear idea of the product-value before committing to it
by registering.

Such workflow designs should be the exceptions rather than the norm as
these are just create friction in the users\' way discovering and using
your services. You can always try to encourage the user to register but
they should not be *forced* to provide any more details than absolutely
mandatory for providing the service intended.

No amount of on-boarding can really offset the friction, such as above,
stemming from a poor app workflow.

Back to on-boarding - how to go about it?
=========================================

The actual ideal process may vary from one product to another. It will
also depend on the on-boarding stage you are at or the specific metrics
you are trying to optimize.

But there are a few thing to keep in mind: - On-boarding is NOT a one
time activity - On-boarding as a process has to be there at the
beginning to let the user know - It has to be available contextually
whenever there is a new feature to explore - On-boarding does not have
to be limited just to the app itself - Welcome message via text / email
are vital hooks, in case the user never activates the app after
installing - Nudges to an inactive user through app notifications / text
/ email are all closely related to on-boarding - if not part of the
process itself - On-boarding as part of product development needs to be
revisited regularly - helps to spot issues in user engagement - also
helps in identifying difficult / confusing/ / sub-optimal app workflows

***Some of my favorite on-boarding examples (in no particular order)***
- Allo the game - Workflowy (?)

***Further References***\
You may find the below resources really helpful for a progressively
deeper review of the topic: 1.
https://www.usertesting.com/blog/user-onboarding-techniques-for-mobile-apps/
2.
https://medium.com/\@the\_manifest/6-user-onboarding-flows-for-mobile-apps-ef974a330ac1
3.
https://www.intercom.com/blog/c-a-r-e-simple-framework-user-onboarding/
4. https://www.intercom.com/books/onboarding

The case of Gwynnie Bee
=======================

[Gwynnie Bee](https://closet.gwynniebee.com/) is essentially a womens\'
clothing rental with a subscription model.

Current state of the app - the experience
-----------------------------------------

-   No native app at the moment, just a wrapper for the website
-   *Over 30 seconds* on the splash screen itself !

Since the native app development has hardly started, I would not focus
on the app specific issues at this stage. But a 30 seconds wait on the
splash screen - on *any* device - is appalling! And this was a recurring
wait across multiple launches.

As the app is essentially a wrapper for the website, the rest of the
current workflow discussion is based on the website workflow.

Which brings me to the unhandled exceptions such as JS support not
available or cross-origin and remote fonts blocked. Gbee\'s website is
guilty of being part of a prevalent culture these days of not handling
such situations.

Even in the view of Gbee\'s target segment - young, fashion conscious
women, leaving the exceptional use-cases unhandled based on assumptions
about the user is just lazy and irresponsible. It is definitely going on
my [\"JS hall of shame\"
list](https://proxygeek.github.io/opinions/js-hall-of-shame.html)\
But I digress.

Current workflow
----------------

-   A Get Started call to action (CTA)
-   Size Quiz (3 mandatory questions about brand and size preferences)
-   Brand recommendations and \"save profile\" CTA
    -   *No clear indication of what are these recommendations*
    -   *A user is blocked at this point from any further exploration
        unless registration is complete*
        -   *service value unclear at this stage
            (`"do they have a decent collection?" "how would I order" "how many clothes can I get"`)*
-   Registration flow
    -   Social login through Google or Facebook OR traditional (email +
        password) registration
    -   Mandatory shipping details required in the next step including
        full name, phone and street address
        -   *The shipping details are quite personal and it\'s really a
            bad design to stop user from exploring further without these
            details even after registration*
    -   Mandatory billing information required in next screen for
        completing registration
        -   *This should be the absolute last stage, ideally offered
            right at the moment when the user is at the
            \"shut-up-and-take-my-money\" stage*

This is a classic case of sub-optimal workflow hindering user experience
by trying to increase registration at the cost of wider user-discovery /
adoption.

1.  No way to experience the complete flow without actually registering
    for the service
2.  There is no way to register without subscribing

So, essentially the users are being stopped from discovering the value
from the service without agreeing to subscribe.

This underlying workflow needs to be fixed before moving on to create a
good on-boarding experience.

What should be the ideal experience + on-boarding workflow
----------------------------------------------------------

-   3-4 page (max) interstitials cards (coach screens) which explain the
    value proposition of the service (benefits approach) and explain how
    does it work
-   Right after the coach screen, use an action oriented approach to
    lead the first-time user through different stages of the funnel
    (discovering the clothes collection, selection process, and adding
    it to your closet)
    -   This approach leads to quickest value creation for user and
        results in immediate engagement;
-   Prompt the user to register at this stage or carry on with a guest
    account
    -   Without asking for shipping and billing details
-   After registration (or selection of guest-mode), lead the user to
    the next step of ordering their first free box - prompting them to
    click the relevant CTA
-   Ask for the address where they would like it delivered or let them
    choose a dummy-address for demo purpose
-   Provide them an estimate of delivery time and prompt them to provide
    the billing details (your subscription stage) or proceed with dummy
    details
-   Confirm the order (or dummy order) and take them back to the clothes
    collection, prompting them to explore the app on their own
    -   Also send out confirmation emails at each stage - including
        custom ones for dummy orders - to encourage them to come back to
        the service

If you are a clothing provider, a user should feel the same or higher
level of comfort and joy of shopping when she goes to her favorite store
or finds an amazing new one in the real world. Imagine your reaction if
your favorite store would not even let you in before you handing over
your name, email address, postal address and credit-card details first.
Would not remain your favorite for long, would it?

And that goes for all the products / services. Encourage your users to
do more, not less.

`I am sure I have left out a lot of good points and / or simply might have been wrong about some of them. Please feel free to share your thoughts.`
