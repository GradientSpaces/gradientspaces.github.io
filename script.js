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
    article.append(createPortrait(person));
    article.append(createEl("h3", "", person.name));
    article.append(createEl("p", "role", person.role));
    if (person.website) {
      appendLinks(article, [{ label: "Website", url: person.website }]);
    }
    target.append(article);
  });
};

const renderFeaturedProjects = () => {
  const target = document.querySelector("#featured-projects");
  if (!target || !window.siteData) return;

  target.innerHTML = "";
  window.siteData.publications
    .filter((publication) => publication.image)
    .slice(0, 3)
    .forEach((publication) => {
      const article = createEl("article", "project-card");
      const img = document.createElement("img");
      img.src = publication.image;
      img.alt = `${publication.title} teaser`;
      article.append(img);

      const body = createEl("div");
      body.append(createEl("p", "tag", publication.venue));
      body.append(createEl("h3", "", publication.title));
      body.append(createEl("p", "", publication.authors));
      appendLinks(body, publication.links);
      article.append(body);
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

  if (/\.(mp4|webm|mov)$/i.test(source)) {
    const video = document.createElement("video");
    video.src = source;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", `${publication.title} teaser`);
    wrap.append(video);
  } else {
    const img = document.createElement("img");
    img.src = source;
    img.alt = `${publication.title} teaser`;
    img.loading = "lazy";
    wrap.append(img);
  }

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
    "dynamic-scenes": "Dynamic 3D Scenes",
    reconstruction: "In-the-Wild Reconstruction",
    "mixed-reality": "Mixed Reality",
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
      article.append(createEl("h4", "", chapter.title));
      article.append(createEl("p", "", chapter.authors));
      article.append(createEl("p", "detail-line", chapter.venue));
      appendLinks(article, chapter.links);
      chapterTarget.append(article);
    });
  }

  if (datasetTarget) {
    datasetTarget.innerHTML = "";
    window.siteData.datasets.forEach((dataset) => {
      const anchor = createEl("a", "", dataset.label);
      anchor.href = dataset.url;
      anchor.rel = "noopener";
      datasetTarget.append(anchor);
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
