
const GALLERY_PHOTOS = [

  { file: 'group-photo.jpg.png'  },
  { file: '1.jpg'},
  { file: 'activity-cultural.jpg'  },
  { file: 'activity-mediation.jpg'},
  { file: 'activity-osijek.jpg'    },
  { file: 'activity-nvc.jpg'    },
  { file: 'activity-outputs.jpg' },
  { file: 'IMG20260508111624.jpg'  },
  { file: 'IMG20260508222016.jpg'    },
  { file: 'IMG20260510212841.jpg'    },
  { file: 'IMG20260511120940.jpg'    },
  { file: 'IMG20260511130618.jpg'    },
  { file: 'IMG20260512122907.jpg'    },
  { file: 'Picture1.png'},
  { file: 'Picture3.png'},
  { file: 'trust-walk.jpg.jpg'    },
  { file: 'IMG20260508102758.jpg'    },
  { file: 'IMG20260512122907.jpg'    },


];



const VIDEO_FILES = [
  { file: 'highlight-reel1.mov',  title: 'Project Highlights' },
  { file: 'highlight-reel2.mov',  title: 'Project Highlights' },
  { file: 'highlight-reel3.mov',  title: 'Project Highlights' },
  { file: 'highlight-reel4.mov',  title: 'Project Highlights' },
  { file: 'highlight-reel5.mp4',  title: 'Project Highlights' },
];


(function () {
  const carousel  = document.getElementById('galleryCarousel');
  const btnPrev   = document.getElementById('gcPrev');
  const btnNext   = document.getElementById('gcNext');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  if (!carousel) return;
  if (GALLERY_PHOTOS.length === 0) return; // keep placeholder

  let currentLbIdx = 0;

  // Build carousel items
  carousel.innerHTML = '';
  GALLERY_PHOTOS.forEach((photo, idx) => {
    const item = document.createElement('div');
    item.className = 'gc-item';

    const img = document.createElement('img');
    img.src     = `assets/images/gallery/${photo.file}`;
    img.alt     = photo.caption || `Photo ${idx + 1}`;
    img.loading = 'lazy';
    img.onerror = function () {
      this.style.display = 'none';
      item.classList.add('gc-item--broken');
      item.innerHTML += `<span class="gc-broken-icon">🖼️</span>`;
    };

    item.appendChild(img);
    if (photo.caption) {
      const cap = document.createElement('p');
      cap.className = 'gc-caption';
      cap.textContent = photo.caption;
      item.appendChild(cap);
    }
    item.addEventListener('click', () => openLightbox(idx));
    carousel.appendChild(item);
  });

  // Scroll helpers
  function scrollBy(dir) {
    const itemW = carousel.querySelector('.gc-item')?.offsetWidth || 320;
    carousel.scrollBy({ left: dir * (itemW + 12), behavior: 'smooth' });
  }
  btnPrev && btnPrev.addEventListener('click', () => scrollBy(-1));
  btnNext && btnNext.addEventListener('click', () => scrollBy(1));

  // Lightbox
  function openLightbox(idx) {
    currentLbIdx = idx;
    const p = GALLERY_PHOTOS[idx];
    lbImg.src = `assets/images/gallery/${p.file}`;
    lbImg.alt = p.caption || '';
    lbCaption.textContent = p.caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  function showPrev() { openLightbox((currentLbIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length); }
  function showNext() { openLightbox((currentLbIdx + 1) % GALLERY_PHOTOS.length); }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev  && lbPrev .addEventListener('click', showPrev);
  lbNext  && lbNext .addEventListener('click', showNext);
  lightbox && lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* ══════════════════════════════════════
   VIDEO CAROUSEL
══════════════════════════════════════ */
(function () {
  const vc    = document.getElementById('videoCarousel');
  const dots  = document.getElementById('vcDots');
  const vPrev = document.getElementById('vcPrev');
  const vNext = document.getElementById('vcNext');

  if (!vc) return;
  if (VIDEO_FILES.length === 0) return; // keep placeholder

  let currentVideo = 0;

  vc.innerHTML = '';
  dots && (dots.innerHTML = '');

  VIDEO_FILES.forEach((v, idx) => {
    const slide = document.createElement('div');
    slide.className = 'vc-slide' + (idx === 0 ? ' vc-slide--active' : '');

    const video = document.createElement('video');
    video.src      = `assets/images/gallery/${v.file}`;
    video.controls = true;
    video.preload  = 'metadata';
    video.setAttribute('playsinline', '');
    video.onerror = function () {
      slide.innerHTML = `<div class="vc-broken"><span>🎬</span><p>Video unavailable</p></div>`;
    };

    const title = document.createElement('p');
    title.className = 'vc-title';
    title.textContent = v.title || v.file;

    slide.appendChild(video);
    slide.appendChild(title);
    vc.appendChild(slide);

    // dot
    if (dots) {
      const dot = document.createElement('button');
      dot.className = 'vc-dot' + (idx === 0 ? ' vc-dot--active' : '');
      dot.setAttribute('aria-label', `Video ${idx + 1}`);
      dot.addEventListener('click', () => goTo(idx));
      dots.appendChild(dot);
    }
  });

  function goTo(idx) {
    const slides = vc.querySelectorAll('.vc-slide');
    const dotEls = dots ? dots.querySelectorAll('.vc-dot') : [];

    // pause current video
    const curVid = slides[currentVideo]?.querySelector('video');
    if (curVid) curVid.pause();

    slides[currentVideo]?.classList.remove('vc-slide--active');
    dotEls[currentVideo]?.classList.remove('vc-dot--active');

    currentVideo = (idx + VIDEO_FILES.length) % VIDEO_FILES.length;

    slides[currentVideo]?.classList.add('vc-slide--active');
    dotEls[currentVideo]?.classList.add('vc-dot--active');
  }

  vPrev && vPrev.addEventListener('click', () => goTo(currentVideo - 1));
  vNext && vNext.addEventListener('click', () => goTo(currentVideo + 1));
})();