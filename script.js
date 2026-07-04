const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.title = isOpen ? "Close navigation" : "Open navigation";
  });
}

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
    const meta = createEl("div", "pub-meta");
    meta.append(createEl("span", "", publication.year));
    meta.append(createEl("span", "", publication.venue));
    article.append(meta);

    article.append(createPubMedia(publication));

    const body = createEl("div");
    body.append(createEl("h3", "", publication.title));
    body.append(createEl("p", "", publication.authors));
    appendLinks(body, publication.links);
    article.append(body);
    target.append(article);
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
renderFeaturedProjects();
renderPublications();
renderResources();
