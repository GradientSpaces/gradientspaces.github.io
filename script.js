const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.title = isOpen ? "Close navigation" : "Open navigation";
  });
}

const initializeGalleries = () => {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
    const dots = [...gallery.querySelectorAll("[data-gallery-dot]")];
    const previous = gallery.querySelector("[data-gallery-previous]");
    const next = gallery.querySelector("[data-gallery-next]");
    const pause = gallery.querySelector("[data-gallery-pause]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = 0;
    let timer;
    let isPaused = reduceMotion;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    const stopTimer = () => {
      window.clearInterval(timer);
      timer = undefined;
    };

    const startTimer = () => {
      stopTimer();
      if (!isPaused && !document.hidden) {
        timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
      }
    };

    const refreshPauseButton = () => {
      if (!pause) return;
      pause.textContent = isPaused ? "Play" : "Pause";
      pause.setAttribute("aria-pressed", String(isPaused));
    };

    previous?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startTimer();
    });
    next?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startTimer();
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.galleryDot));
        startTimer();
      });
    });
    pause?.addEventListener("click", () => {
      isPaused = !isPaused;
      refreshPauseButton();
      startTimer();
    });
    document.addEventListener("visibilitychange", startTimer);

    showSlide(0);
    refreshPauseButton();
    startTimer();
  });
};

const createEl = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const slugify = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const appendLinks = (parent, links = []) => {
  if (!links.length) return;
  const linkWrap = createEl("div", "profile-links");
  links.forEach((link) => {
    const anchor = createEl("a", "", link.label);
    anchor.href = link.url;
    anchor.rel = "noopener";
    linkWrap.append(anchor);
  });
  parent.append(linkWrap);
};

const createPortrait = (person, size = "") => {
  if (!person.photo) {
    return createEl("div", `avatar ${size}`.trim(), person.initials);
  }

  const wrapper = createEl("div", `portrait ${size}`.trim());
  const img = document.createElement("img");
  img.src = person.photo;
  img.alt = `${person.name} headshot`;
  img.loading = "lazy";
  wrapper.append(img);
  return wrapper;
};

const renderFaculty = () => {
  const target = document.querySelector("#faculty-list");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.people.faculty.forEach((person) => {
    const article = createEl("article", "profile-feature");
    article.id = slugify(person.name);
    article.append(createPortrait(person, "large"));

    const body = createEl("div");
    body.append(createEl("h3", "", person.name));
    body.append(createEl("p", "role", person.role));
    body.append(createEl("p", "", person.bio));
    appendLinks(body, person.links);
    article.append(body);
    target.append(article);
  });
};

const renderPeople = () => {
  const target = document.querySelector("#current-people");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.people.current.forEach((person) => {
    const article = createEl("article", "person-card");
    article.id = slugify(person.name);
    article.append(createPortrait(person));
    article.append(createEl("h3", "", person.name));
    article.append(createEl("p", "role", person.role));
    article.append(createEl("p", "", person.research));

    if (person.website) {
      appendLinks(article, [{ label: "Website", url: person.website }]);
    }
    target.append(article);
  });

  const joinCard = createEl("a", "person-card join-card");
  const joinPortrait = createEl("div", "portrait join-portrait", "+");
  joinPortrait.setAttribute("aria-hidden", "true");
  joinCard.append(joinPortrait);
  joinCard.append(createEl("h3", "", "Join the lab"));
  joinCard.append(createEl("p", "role", "Google Form"));
  joinCard.append(createEl("p", "", "Application link coming soon."));

  if (window.siteData.joinFormUrl) {
    joinCard.href = window.siteData.joinFormUrl;
    joinCard.rel = "noopener";
    joinCard.setAttribute("aria-label", "Join the lab — open application form");
  } else {
    joinCard.setAttribute("role", "link");
    joinCard.setAttribute("aria-disabled", "true");
    joinCard.setAttribute("aria-label", "Join the lab — application form coming soon");
  }

  target.append(joinCard);
};

const renderAlumni = () => {
  const target = document.querySelector("#alumni-list");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.people.alumni.forEach((person) => {
    const article = createEl("article", "person-card alumni-card");
    article.id = slugify(person.name);
    article.append(createPortrait(person));
    article.append(createEl("h3", "", person.name));
    article.append(createEl("p", "role", person.role));
    article.append(createEl("p", "affiliation", person.affiliation));
    if (person.year) {
      article.append(createEl("p", "year-line", person.year));
    }
    if (person.website) {
      appendLinks(article, [{ label: "Website", url: person.website }]);
    }
    target.append(article);
  });
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createTeaserElement = (source, title) => {
  if (/\.(mp4|webm|mov)$/i.test(source)) {
    const video = document.createElement("video");
    video.src = source;
    video.autoplay = !prefersReducedMotion;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = prefersReducedMotion ? "auto" : "metadata";
    video.setAttribute("aria-label", `${title} teaser`);
    return video;
  }

  const img = document.createElement("img");
  img.src = source;
  img.alt = `${title} teaser`;
  img.loading = "lazy";
  return img;
};

// Animated teasers (videos and GIFs) get a pause/play button (WCAG 2.2.2).
// GIFs can't be paused natively, so a paused GIF is swapped for a canvas
// holding its current frame.
const freezeGif = (img) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d").drawImage(img, 0, 0);
  if (img.alt) {
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", img.alt);
  }
  img.after(canvas);
  img.style.display = "none";
  img.frozenFrame = canvas;
};

const unfreezeGif = (img) => {
  img.frozenFrame?.remove();
  img.frozenFrame = null;
  img.style.display = "";
};

const addMotionToggle = (media) => {
  const frame = media.closest(".pub-media, .project-card, .event-media");
  if (!frame || frame.querySelector(".motion-toggle")) return;

  const isVideo = media.tagName === "VIDEO";
  const title =
    media.closest("article")?.querySelector("h3, h4")?.textContent.trim() || "teaser";
  const button = createEl("button", "motion-toggle");
  button.type = "button";

  const isPaused = () => (isVideo ? media.paused : Boolean(media.frozenFrame));
  const refresh = () => {
    const paused = isPaused();
    button.textContent = paused ? "▶" : "❚❚";
    button.setAttribute("aria-label", `${paused ? "Play" : "Pause"} animation: ${title}`);
  };

  const pause = () => {
    if (isVideo) media.pause();
    else if (!media.frozenFrame) freezeGif(media);
    refresh();
  };

  const play = () => {
    if (isVideo) media.play();
    else unfreezeGif(media);
    refresh();
  };

  button.addEventListener("click", () => (isPaused() ? play() : pause()));
  if (isVideo) {
    media.addEventListener("play", refresh);
    media.addEventListener("pause", refresh);
  }
  frame.append(button);

  if (prefersReducedMotion) {
    if (isVideo || (media.complete && media.naturalWidth)) pause();
    else media.addEventListener("load", pause, { once: true });
  }
  refresh();
};

const initMotionControls = () => {
  document
    .querySelectorAll(
      ".pub-media video, .pub-media img[src$='.gif'], .project-card video, .project-card img[src$='.gif'], .event-media video, .event-media img[src$='.gif']"
    )
    .forEach(addMotionToggle);
};

const FEATURED_LAST_AUTHOR = "Iro Armeni";

const isPreprint = (venue = "") => /arxiv/i.test(venue);

const getLastAuthor = (authors = "") =>
  authors
    .split(",")
    .pop()
    .trim()
    .replace(/^and\s+/i, "")
    .replace(/[*†‡]+$/, "")
    .trim();

const renderFeaturedProjects = () => {
  const target = document.querySelector("#featured-projects");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.publications
    .filter(
      (publication) =>
        publication.image &&
        !isPreprint(publication.venue) &&
        getLastAuthor(publication.authors) === FEATURED_LAST_AUTHOR
    )
    .slice(0, 3)
    .forEach((publication) => {
      const article = createEl("article", "project-card");
      article.append(
        createTeaserElement(publication.media || publication.image, publication.title)
      );

      const body = createEl("div");
      body.append(createEl("p", "tag", publication.venue));
      body.append(createEl("h3", "", publication.title));
      body.append(createEl("p", "", publication.authors));
      appendLinks(body, publication.links);
      article.append(body);

      const primaryLink =
        publication.links?.find((l) => l.label === "Website") || publication.links?.[0];
      if (primaryLink) {
        const overlay = createEl("a", "card-link-overlay");
        overlay.href = primaryLink.url;
        overlay.rel = "noopener";
        overlay.setAttribute("aria-label", publication.title);
        article.append(overlay);
      }

      target.append(article);
    });
};

const createPubMedia = (publication) => {
  const wrap = createEl("div", "pub-media");
  const source = publication.media || publication.image;

  if (!source) {
    wrap.classList.add("empty");
    return wrap;
  }

  wrap.append(createTeaserElement(source, publication.title));
  return wrap;
};

const renderPublications = () => {
  const target = document.querySelector("#publication-list");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.publications.forEach((publication) => {
    const article = createEl("article", "publication-row");
    article.append(createPubMedia(publication));

    const body = createEl("div");
    body.append(createEl("h3", "", publication.title));
    body.append(createEl("p", "", publication.authors));

    const venueHasYear = /\b(19|20)\d{2}\b/.test(publication.venue);
    const venueLabel = venueHasYear ? publication.venue : `${publication.venue} · ${publication.year}`;
    body.append(createEl("p", "pub-venue", venueLabel));

    if (publication.award) {
      body.append(createEl("p", "pub-award", publication.award));
    }

    appendLinks(body, publication.links);
    article.append(body);
    target.append(article);
  });
};

const renderResearchThemes = () => {
  const buttons = [...document.querySelectorAll(".theme-button[data-topic]")];
  const target = document.querySelector("#theme-papers");
  if (!buttons.length || !target || !window.siteData) return;

  const topicLabels = {
    "dynamic-scenes": "Dynamic and Evolving 3D Scenes",
    "reconstruction": "In-the-Wild Reconstruction & Mapping",
    "generative-design": "Generative Spatial Design",
    "embodied-intelligence": "Embodied Intelligence",
    "sustainable-environments": "Sustainable Environments"
  };

  const closeThemes = () => {
    buttons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      const toggleIcon = button.querySelector(".theme-toggle");
      if (toggleIcon) toggleIcon.textContent = "+";
    });
    target.hidden = true;
    target.innerHTML = "";
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.dataset.topic;
      const wasOpen = button.getAttribute("aria-expanded") === "true";
      closeThemes();
      if (wasOpen) return;

      const publications = window.siteData.publications.filter((publication) =>
        publication.topics?.includes(topic)
      );

      button.setAttribute("aria-expanded", "true");
      const toggleIcon = button.querySelector(".theme-toggle");
      if (toggleIcon) toggleIcon.textContent = "−";

      const heading = createEl("div", "theme-papers-heading");
      heading.append(createEl("h3", "", topicLabels[topic]));
      heading.append(createEl("p", "", `${publications.length} ${publications.length === 1 ? "paper" : "papers"}`));
      target.append(heading);

      publications.forEach((publication) => {
        const article = createEl("article", "theme-paper");
        const body = createEl("div");
        body.append(createEl("h4", "", publication.title));
        body.append(createEl("p", "", publication.authors));
        const venueHasYear = /\b(19|20)\d{2}\b/.test(publication.venue);
        const venueLabel = venueHasYear ? publication.venue : `${publication.venue} · ${publication.year}`;
        if (publication.award) {
          body.append(createEl("p", "pub-award", publication.award));
        }
        body.append(createEl("p", "pub-venue", venueLabel));
        article.append(body);
        appendLinks(article, publication.links);

        target.append(article);
      });

      target.hidden = false;
    });
  });
};

const renderResources = () => {
  const chapterTarget = document.querySelector("#chapter-list");
  const datasetTarget = document.querySelector("#dataset-list");
  if (!window.siteData) return;

  if (chapterTarget) {
    chapterTarget.innerHTML = "";
    window.siteData.chapters.forEach((chapter) => {
      const article = createEl("article", "resource-item");
      article.append(createEl("h3", "", chapter.title));
      article.append(createEl("p", "", chapter.authors));
      article.append(createEl("p", "detail-line", chapter.venue));
      appendLinks(article, chapter.links);
      chapterTarget.append(article);
    });
  }

  if (datasetTarget) {
    datasetTarget.innerHTML = "";
    window.siteData.datasets.forEach((dataset) => {
      const card = createEl("a", "dataset-card");
      card.href = dataset.url;
      card.rel = "noopener";
      card.append(createEl("h3", "", dataset.label));
      if (dataset.description) {
        card.append(createEl("p", "", dataset.description));
      }
      card.append(createEl("span", "text-link", "View dataset"));
      datasetTarget.append(card);
    });
  }
};

renderFaculty();
renderPeople();
renderAlumni();
initializeGalleries();
renderFeaturedProjects();
renderPublications();
renderResearchThemes();
renderResources();
initMotionControls();

// Stanford Global Footer (from Decanter, identity.stanford.edu). Set to false to remove it.
const SHOW_STANFORD_GLOBAL_FOOTER = true;

const renderStanfordGlobalFooter = () => {
  const localFooter = document.querySelector(".site-footer");
  if (!SHOW_STANFORD_GLOBAL_FOOTER || !localFooter) return;

  const linkGroups = [
    [
      ["Stanford Home", "https://www.stanford.edu"],
      ["Maps & Directions", "https://visit.stanford.edu/plan/"],
      ["Search Stanford", "https://www.stanford.edu/search/"],
      ["Emergency Info", "https://emergency.stanford.edu"],
    ],
    [
      ["Terms of Use", "https://www.stanford.edu/site/terms/", "Terms of use for sites"],
      ["Privacy", "https://www.stanford.edu/site/privacy/", "Privacy and cookie policy"],
      ["Copyright", "https://uit.stanford.edu/security/copyright-infringement", "Report alleged copyright infringement"],
      ["Trademarks", "https://adminguide.stanford.edu/chapter-1/subchapter-5/policy-1-5-4", "Ownership and use of Stanford trademarks and images"],
      ["Non-Discrimination", "https://studentservices.stanford.edu/more-resources/student-policies/non-academic/non-discrimination", "Non-discrimination policy"],
      ["Accessibility", "https://www.stanford.edu/site/accessibility", "Report web accessibility issues"],
    ],
  ];

  // A labelled region, not a second <footer>, so the page keeps a single footer landmark.
  const footer = createEl("div", "global-footer");
  footer.setAttribute("role", "region");
  footer.setAttribute("aria-label", "Stanford University resources");
  const inner = createEl("div", "global-footer-inner");
  inner.title = "Common Stanford resources";

  const logo = createEl("a", "global-footer-logo");
  logo.href = "https://www.stanford.edu";
  logo.append("Stanford", document.createElement("br"), "University");
  inner.append(logo);

  const body = createEl("div", "global-footer-body");
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "global footer menu");
  linkGroups.forEach((group) => {
    const list = document.createElement("ul");
    group.forEach(([label, url, title]) => {
      const item = document.createElement("li");
      const link = createEl("a", "", label);
      link.href = url;
      if (title) link.title = title;
      link.append(createEl("span", "sr-only", " (link is external)"));
      item.append(link);
      list.append(item);
    });
    nav.append(list);
  });
  body.append(nav);
  body.append(createEl("p", "global-footer-copyright", "© Stanford University.  Stanford, California 94305."));
  inner.append(body);

  footer.append(inner);
  localFooter.after(footer);
  document.body.classList.add("has-global-footer");
};

renderStanfordGlobalFooter();

const focusLinkedCard = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const card = id && document.getElementById(id);
  if (!card || !card.matches(".person-card, .profile-feature")) return;

  card.classList.add("is-linked");
  window.addEventListener("load", () => card.scrollIntoView({ block: "center" }), { once: true });
};

focusLinkedCard();
