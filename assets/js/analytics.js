(function () {
  'use strict';

  var page = window.siteAnalyticsPage || {};
  var measurementId = page.measurementId;
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(googleTag);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  var baseParameters = {
    page_type: page.pageType,
    content_type: page.contentType,
    content_category: page.contentCategory,
    content_title: page.contentTitle,
    content_slug: page.contentSlug,
    content_date: page.contentDate,
    layout_name: page.layoutName,
    site_section: page.siteSection
  };

  function cleanParameters(parameters) {
    var clean = {};
    Object.keys(parameters || {}).forEach(function (key) {
      if (parameters[key] !== undefined && parameters[key] !== null && parameters[key] !== '') {
        clean[key] = parameters[key];
      }
    });
    return clean;
  }

  function track(eventName, parameters) {
    window.gtag('event', eventName, cleanParameters(Object.assign({}, baseParameters, parameters || {})));
  }

  function normalizedUrl(anchor) {
    try {
      return new URL(anchor.href, window.location.href);
    } catch (error) {
      return null;
    }
  }

  function destinationParameters(anchor) {
    var url = normalizedUrl(anchor);
    if (!url) return {};

    var isInternal = url.origin === window.location.origin;
    return {
      destination_type: isInternal ? 'internal' : 'external',
      destination_domain: url.hostname.toLowerCase(),
      destination_path: url.pathname
    };
  }

  function linkText(anchor) {
    return (anchor.getAttribute('aria-label') || anchor.textContent || '').trim().slice(0, 100);
  }

  function destinationTitle(anchor) {
    var heading = anchor.querySelector && anchor.querySelector('h3, h2, .post-card-header');
    return (heading ? heading.textContent : linkText(anchor)).trim().slice(0, 100);
  }

  function linkLocation(anchor) {
    if (anchor.closest('header nav')) return 'header';
    if (anchor.closest('.post-navigation')) return 'post';
    if (anchor.closest('.post-card')) return 'listing';
    if (anchor.closest('.post-content')) return 'post';
    if (anchor.closest('footer')) return 'footer';
    return page.siteSection || 'content';
  }

  function trackLink(anchor) {
    if (page.pageType === 'demo') return;
    if (anchor.hasAttribute('download')) return;

    var url = normalizedUrl(anchor);
    if (!url) return;

    var location = linkLocation(anchor);
    var destination = destinationParameters(anchor);
    var text = linkText(anchor);
    var title = destinationTitle(anchor);
    var path = url.pathname.toLowerCase();
    var isFeed = path === '/feed.xml' || path.endsWith('/feed.xml');
    var isOpml = path.endsWith('.opml');
    var isCard = !!anchor.closest('.post-card');
    var isPrevious = anchor.classList.contains('prev-post');
    var isNext = anchor.classList.contains('next-post');
    var isRelated = url.origin === window.location.origin && !!anchor.closest('.post-content');

    if (isFeed) {
      track('feed_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'feed',
        destination_type: 'feed',
        link_text: text
      }));
    } else if (isOpml) {
      track('file_download', Object.assign({}, destination, {
        link_location: location,
        link_type: 'file',
        destination_type: 'file',
        link_text: text
      }));
    } else if (isPrevious) {
      track('previous_post_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'previous_post',
        link_text: text,
        destination_content_title: title
      }));
    } else if (isNext) {
      track('next_post_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'next_post',
        link_text: text,
        destination_content_title: title
      }));
    } else if (isCard) {
      track('content_card_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'content_card',
        link_text: text,
        destination_content_title: title
      }));
    } else if (isRelated) {
      track('related_content_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'related_content',
        link_text: text
      }));
    } else if (url.origin !== window.location.origin) {
      track('external_link_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'external',
        link_text: text,
        destination_type: 'external'
      }));
    } else if (anchor.closest('header nav')) {
      track('navigation_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'navigation',
        link_text: text
      }));
    } else if (url.origin === window.location.origin) {
      track('navigation_click', Object.assign({}, destination, {
        link_location: location,
        link_type: 'navigation',
        link_text: text
      }));
    }
  }

  function trackNewsletterSubmit(form) {
    track('newsletter_submit', {
      link_location: linkLocation(form),
      link_type: 'newsletter',
      destination_type: 'newsletter'
    });
  }

  function trackReadingDepth() {
    var excluded = ['tool', 'game', 'demo'];
    if (excluded.indexOf(page.pageType) !== -1) return;
    if (['home', 'static_page', 'listing', 'post', 'archive'].indexOf(page.pageType) === -1) return;

    var thresholds = [25, 50, 75, 90];
    var sent = {};
    var ticking = false;

    function checkDepth() {
      ticking = false;
      var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      var percent = (window.scrollY / scrollableHeight) * 100;
      thresholds.forEach(function (threshold) {
        if (percent >= threshold && !sent[threshold]) {
          sent[threshold] = true;
          track('reading_depth', {
            percent_scrolled: threshold,
            reading_surface: page.pageType,
            reading_category: page.contentCategory
          });
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(checkDepth);
        ticking = true;
      }
    }, { passive: true });
    checkDepth();
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target.closest && event.target.closest('a');
    if (anchor) trackLink(anchor);
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (form.matches && form.matches('form[action*="follow.it"]')) {
      trackNewsletterSubmit(form);
    }
  });

  track('page_view', {
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer
  });
  trackReadingDepth();

  window.siteAnalytics = {
    track: track,
    page: page
  };
})();
