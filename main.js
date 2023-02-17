const version = 9;
const logging = false;
console.log(`Loaded Green Air JS – Version: ${version}`);
//
// Classes and Functions
//

function Log(...args) {
  if (!logging) return;
  console.log(...args);
}

class ProjectsList {
  projectsListView = null;
  projectsGridView = null;
  projectsGridViewControl = null;
  projectsListViewControl = null;
  projectListFilter = null;
  projects = [];

  constructor() {
    this.gridView = this.gridView.bind(this);
    this.listView = this.listView.bind(this);
    this.filter = this.filter.bind(this);

    // Load the projects lists.
    this.initialiseProjects();
    this.initialiseControls();
    this.gridView();
    this.collectProjects();
    this.projectListFilter = new ProjectListFilter(this);
  }

  initialiseProjects() {
    this.projectsListView = document.querySelector('.green-air__projects__listview');
    this.projectsGridView = document.querySelector('.green-air__projects__gridview');
  }

  initialiseControls() {
    // Toggle the view controls.
    this.projectsGridViewControl = document.querySelector('.green-air__filter__icon__block');
    this.projectsListViewControl = document.querySelector('.green-air__filter__icon__list');

    if (this.projectsGridViewControl != null) {
      this.projectsGridViewControl.addEventListener('click', () => {
        this.gridView();
      });
    }

    if (this.projectsListViewControl != null) {
      this.projectsListViewControl.addEventListener('click', () => {
        this.listView();
      });
    }
  }

  gridView() {
    this.projectsListView.classList.add('hidden');
    this.projectsListViewControl.classList.add('deselected');
    this.projectsGridView.classList.remove('hidden');
    this.projectsGridViewControl.classList.remove('deselected');

  }

  listView() {
    this.projectsGridView.classList.add('hidden');
    this.projectsGridViewControl.classList.add('deselected');
    this.projectsListView.classList.remove('hidden');
    this.projectsListViewControl.classList.remove('deselected');
  }

  collectProjects() {
    this.listProjects = document.querySelector('.green-air__projects__listview .w-dyn-items').children;
    this.gridProjects = document.querySelector('.green-air__projects__gridview .w-dyn-items').children;
    for (let i = 0; i < this.listProjects.length; i++) {
      const listProject = this.listProjects[i];
      const gridProject = this.gridProjects[i];
      const projectTypes = [...listProject.querySelectorAll('.green-air__projects__list__project-type-name')].map(projectType => projectType.innerText);
      projectTypes.push('All Projects');
      this.projects.push({
        grid: gridProject,
        list: listProject,
        types: projectTypes
      });
    }
  }

  filter(projectType) {
    this.projects.forEach((project, i) => {
      if (project.types.includes(projectType)) {
        project.grid.classList.remove('hidden');
        project.list.classList.remove('hidden');
      } else {
        project.grid.classList.add('hidden');
        project.list.classList.add('hidden');
      }
    });

  }
}

class ProjectListFilter {
  projects = null;
  projectFilters = null;
  filterContainer = null;
  allFilter = null;

  constructor(projects) {
    this.projects = projects;
    this.filterProjects = this.filterProjects.bind(this);

    this.filterContainer = document.querySelector('.green-air__projects__filter__wrapper');
    this.allFilter = this.filterContainer.firstChild;
    if (this.allFilter != null) {
      this.allFilter = this.allFilter.cloneNode(true);
      this.allFilter.classList.add('selected');
      this.allFilter.querySelector('.green-air__projects__filter__name').innerText = 'All Projects';
      this.filterContainer.insertBefore(this.allFilter, this.filterContainer.firstChild);

      this.projectFilters = this.filterContainer.children;
      [...this.projectFilters].forEach((projectFilter, i) => {
        projectFilter.addEventListener('click', () => {
          this.filterProjects(projectFilter);
        });
      });
    }
  }

  filterProjects(project) {
    [...this.projectFilters].forEach((projectFilter, i) => {
      if (projectFilter === project) {
        projectFilter.classList.add("selected");
      } else {
        projectFilter.classList.remove("selected");
      }
    });
    this.projects.filter(project.querySelector('.green-air__projects__filter__name').innerText);
  }
}

class HoverCarousel {
  // Parent: js__parent-hover
  // Carousel: js__green-air__hover-carousel
  // -- Has Parent: js__target-parent-hover
  // Slide: js__green-air__hover-carousel__slide
  // -- Inactive Slide: inactive-slide

  hoverTarget = null;
  element = null;
  slides = [];
  currentSlideIndex = 0;
  rotationInterval = null;
  mainSlide = null;
  loadedImage = false;

  constructor(element) {
    this.startRotatingSlides = this.startRotatingSlides.bind(this);
    this.stopRotatingSlides = this.stopRotatingSlides.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.setSlideSizes = this.setSlideSizes.bind(this);
    this.updateSlideSizes = this.updateSlideSizes.bind(this);

    this.element = element;
    this.findTarget();

    let allSlides = [...element.children];
    const previousSrc = [];
    for (let i = 0; i < allSlides.length; i += 1) {
      let slide = allSlides[i];
      let src = slide.getAttribute("src");
      if (src != null && src.trim().length !== 0 && !previousSrc.includes(src)) {
        this.slides.push(slide);
        previousSrc.push(src);
      } else {
        slide.remove();
      }
    }
    this.mainSlide = this.slides[0];
    if (this.mainSlide != null) {
      this.setSlideSizes();
      window.addEventListener('resize', () => {
        this.setSlideSizes();
      });

      this.target.addEventListener('mouseenter', () => {
        this.startRotatingSlides();
      });
      this.target.addEventListener('mouseleave', () => {
        this.stopRotatingSlides();
      });
    }
  }

  startRotatingSlides() {
    this.changeSlide();
    clearInterval(this.rotationInterval);
    this.rotationInterval = setInterval(() => {
      this.changeSlide();
    }, 1000);
  }

  setSlideSizes() {
    if (!this.mainSlide) return false;
    if (this.mainSlide.complete && this.mainSlide.naturalHeight !== 0) {
      this.updateSlideSizes();
      return true;
    }
    return false;
  }

  updateSlideSizes() {
    this.loaded = true;
    let rect = this.mainSlide.getBoundingClientRect();
    this.slides.forEach((slide, i) => {
      if (i > 0) {
        slide.style.width = `${rect.width}px`;
        slide.style.height = `${rect.height}px`;
        slide.style.minWidth = `${rect.width}px`;
        slide.style.minHeight = `${rect.height}px`;
        slide.style.maxWidth = `${rect.width}px`;
        slide.style.maxHeight = `${rect.height}px`;
      }
    });
  }

  changeSlide() {
    if (!this.loaded) {
      const loaded = this.setSlideSizes();
      if (!loaded) {
        return;
      }
    }
    const prevIndex = this.currentSlideIndex;
    const prevSlide = this.slides[prevIndex];
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    if (prevIndex === this.currentSlideIndex) return;

    const currentSlide = this.slides[this.currentSlideIndex];
    currentSlide.classList.add('active-slide');
    currentSlide.classList.remove('inactive-slide');
    prevSlide.classList.add('inactive-slide');
    prevSlide.classList.remove('active-slide');
  }

  stopRotatingSlides() {
    clearInterval(this.rotationInterval);
  }

  findTarget() {
    let target = this.element;
    if (this.element.classList.contains('js__target-parent-hover')) {
      let parent = this.element.parentElement;
      let foundParent = false;
      while (!foundParent && parent != null) {
        if (parent.classList.contains('js__parent-hover')) {
          foundParent = true;
        } else {
          parent = parent.parentElement;
        }
      }
      target = parent;
    }
    if (target === null) {
      console.log("Failed to find parent – Using element as target", target);
    }
    this.target = target;``
  }
}

class AboutUsNav {
  lastScrollTop = null;

  constructor(aboutUsNav) {
    this.aboutUsNav = aboutUsNav;
    this.nextSibling = aboutUsNav.nextElementSibling;
    this.scrolledNav = this.scrolledNav.bind(this);
    this.sticky = false;
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.scrolledMenu = this.scrolledMenu.bind(this);

    this.aboutUsNav.classList.add('js-about-us-nav');
    // let navbar = document.body.querySelector('.navbar');
    // if (navbar != null) {
    //   navbar.classList.add('js-remove-sticky');
    // }

    this.scrolledNav();
    window.addEventListener('scroll', () => {
      this.scrolledNav();
      this.scrolledMenu();
    });
  }

  scrolledNav() {
    const rect = this.nextSibling.getBoundingClientRect();
    if (!this.sticky && rect.top <= 0) {
      this.sticky = true;
      this.aboutUsNav.classList.add('js-visible');
    } else if (this.sticky && rect.top > 0) {
      this.sticky = false;
      this.aboutUsNav.classList.remove('js-visible');
    }
  }

  scrolledMenu() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.aboutUsNav.classList.add('scrolled-away');
    } else {
      this.aboutUsNav.classList.remove('scrolled-away');
    }
    this.lastScrollTop = scrollTop;
  }
}

class MenuBar {
  menuBar = null;
  desktopMenuBtn = null;
  mobileMenuBtn = null;
  expandedMenu = null;
  lastScrollTop = null;
  currentStyleAlt = false;
  expandedStyleAlt = false;

  constructor(menuBar) {
    this.menuBar = menuBar;
    this.desktopMenuBtn = this.menuBar.querySelector('.desktop-menu-btn');
    this.mobileMenuBtn = this.menuBar.querySelector('.mobile-menu-btn');
    this.expandedMenu = this.menuBar.querySelector('.green-air__menu-expanded');
    this.toggleMenu = this.toggleMenu.bind(this);
    this.scrolledMenu = this.scrolledMenu.bind(this);

    this.attachClickListener(this.desktopMenuBtn);
    this.attachClickListener(this.mobileMenuBtn);
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.realClientHeightListeners.push(this);


    window.addEventListener('scroll', () => {
      this.scrolledMenu();
    });
  }

  setVisible() {
    this.menuBar.classList.add('js-navbar-visible');
  }

  notifyResizeEvent() {
    this.expandedMenu.style.maxHeight = `${window.innerHeight}px`;
  }

  attachClickListener(menuBtn) {
    if (menuBtn != null) {
      menuBtn.addEventListener("click", () => {
        this.toggleMenu();
      });
    }
  }

  toggleMenu() {
    const expanded = this.expandedMenu.classList.contains('expanded');
    if (expanded) {
      this.expandedMenu.classList.remove('expanded');
      document.body.classList.remove('disable-scroll');
      if (this.currentStyleAlt != this.expandedStyleAlt) {
        if (this.expandedStyleAlt) {
          this.setAltStyle();
        } else {
          this.setDefaultStyle();
        }
      }
    } else {
      this.expandedStyleAlt = this.currentStyleAlt;
      this.expandedMenu.classList.add('expanded');
      this.expandedMenu.style.maxHeight = `${window.innerHeight}px`;
      document.body.classList.add('disable-scroll');
      this.setDefaultStyle();
    }
  }

  scrolledMenu() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop < 50) {
      this.menuBar.classList.remove('scrolled-away');
    } else if (scrollTop > this.lastScrollTop) {
      this.menuBar.classList.add('scrolled-away');
    } else if (scrollTop < this.lastScrollTop) {
      this.menuBar.classList.remove('scrolled-away');
    }
    this.lastScrollTop = scrollTop;
  }

  setAltStyle() {
    Log('Setting Alt Style!');
    this.menuBar.classList.add('js-alt-visible');
    this.currentStyleAlt = true;
  }

  setDefaultStyle() {
    Log('Setting Default Style!');
    this.menuBar.classList.remove('js-alt-visible');
    this.currentStyleAlt = false;
  }
}

class Slider {
  sliderElement = null;
  slider = null;
  children = null;

  constructor(sliderElement) {
    this.getNumberOfSlides = this.getNumberOfSlides.bind(this);
    this.sliderElement = sliderElement;
    // Duplicate slides 3 times.
    this.children = [...this.sliderElement.children];
    this.initSlider();
  }

  initSlider() {
    if (this.children.length >= 4) {
      for (let i = 0; i < 2; i++) {
        this.children.forEach((node, i) => {
          const duplicate = node.cloneNode(true);
          this.sliderElement.appendChild(duplicate);
        });
      }
    }
    const _this = this;
    this.slider = new KeenSlider(this.sliderElement, {
        loop: true,
        mode: "free-snap",
        slides: {
          perView: this.getNumberOfSlides,
          spacing: 0
        }
      },
      [
        (slider) => {
          let timeout;
          let mouseOver = false;
          function clearNextTimeout() {
            clearTimeout(timeout);
          }
          function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver) return;
            timeout = setTimeout(() => {
              if (_this.children.length >= 4 || _this.getNumberOfSlides() <= _this.children.length) {
                slider.next();
              }
            }, 2000);
          }
          slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
              mouseOver = true;
              clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
              mouseOver = false;
              nextTimeout();
            });
            nextTimeout();
          });
          slider.on("dragStarted", clearNextTimeout);
          slider.on("animationEnded", nextTimeout);
          slider.on("updated", nextTimeout);
        }
      ]
    );
  }

  getNumberOfSlides() {
    const windowWidth = this.getPageWidth();
    if (this.children.length <= 0) return 0;
    const firstChild = this.children[0].firstChild;
    const rect = firstChild.getBoundingClientRect();
    const slideCount = Math.min(4, Math.ceil((windowWidth * 1.0) / (rect.width * 1.0)));
    console.log('Calculating number of slides', slideCount)
    return slideCount;
  }

  getPageWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
}

class SplashImage {
  splashImage = null;
  visible = false;
  scrollY = null;
  ingoreEvent = true;

  constructor(splashImage) {
    this.hideSplash = this.hideSplash.bind(this);
    this.splashImage = splashImage;
    this.visible = true;
    this.splashImage.classList.add('splash-visible');

    window.addEventListener('wheel', () => this.hideSplash());
    window.addEventListener('scroll', (event) => {
      if (ingoreEvent) {
        ingoreEvent = false;
        return;
      }
      this.hideSplash();
    });
    this.splashImage.addEventListener('click', () => this.hideSplash());
  }

  hideSplash() {
    if (this.visible) {
      this.splashImage.classList.add('splash-fade');
      this.visible = false;
    }
  }
}

class StylerController {
  stylers = null;
  menu = null;
  currentStyleAlt = false;
  offset = 80; // navbar is ~ 100px tall.

  constructor(menu) {
    this.stylers = [];
    this.menu = menu;
    this.currentStyleAlt = false;
    this.setMenuStyle = this.setMenuStyle.bind(this);
    this.shouldBeAltStyle = this.shouldBeAltStyle.bind(this);
    window.addEventListener('scroll', () => {
      this.setMenuStyle();
    });

    this.menu.setVisible();
    setTimeout(() => {
      Log('timeout fired, settingMenuStyle');
      this.setMenuStyle();
    }, 10);
  }

  addStyler(styler) {
    this.stylers.push(styler);
  }

  setMenuStyle() {
    Log('SetMenuStyle');
    const altFlag = this.shouldBeAltStyle();
    if (altFlag === this.currentStyleAlt) return;

    if (altFlag) {
      this.menu.setAltStyle();
    } else {
      this.menu.setDefaultStyle();
    }

    this.currentStyleAlt = altFlag;
  }

  shouldBeAltStyle() {
    let scrollY = window.pageYOffset || document.documentElement.scrollTop;
    let altStyle = false;
    Log('ScrollY', scrollY, altStyle);
    for (let i = 0; i < this.stylers.length; i++) {
      const styler = this.stylers[i];
      const rect = styler.element.getBoundingClientRect()
      const top = rect.top + window.scrollY;
      Log('ScrollY', this.offset, rect);
      if ((rect.bottom - this.offset) > 0) {
        Log('ScrollY - Is Above Styler', scrollY, altStyle);
        return altStyle;
      } else {
        altStyle = styler.alt;
      }
    }
    return altStyle;
  }
}

class MenuBarStyler {
  element = null;
  index = -1;
  alt = false;

  constructor(element, index, controller) {
    this.element = element;
    this.index = index;
    this.alt = this.element.classList.contains('menubar-toggle-style-alt');

    controller.addStyler(this);
  }
}

//
// On Load
//
window.addEventListener("load", (event) => {
  window.realClientHeightListeners = [];
  window.realClientHeight = document.querySelector('#control-height').clientHeight;
  window.addEventListener('resize', () => {
    window.realClientHeight = document.querySelector('#control-height').clientHeight;
    for (let i = 0; i < window.realClientHeightListeners.length; i++) {
      let listener = window.realClientHeightListeners[i];
      listener.notifyResizeEvent();
    }
  });

  const projectsContainer = document.querySelector('.green-air__projects__container');
  if (projectsContainer != null) {
    const projectsList = new ProjectsList();
  }

  const hoverCarousels = document.querySelectorAll('.js__green-air__hover-carousel');
  if (hoverCarousels != null) {
    [...hoverCarousels].forEach((hoverCarousel, i) => {
      new HoverCarousel(hoverCarousel);
    });
  }

  const aboutUsNav = document.querySelector('.green-air__aboutus__nav');
  if (aboutUsNav != null) {
    new AboutUsNav(aboutUsNav);
  }

  const menuBar = document.querySelector('.menubar').parentElement;
  if (menuBar != null) {
    const menu = new MenuBar(menuBar);
    let stylerController = new StylerController(menu);
    let menubarStylers = document.querySelectorAll('.menubar-toggle-style, .menubar-toggle-style-alt');
    if (menubarStylers != null) {
      [...menubarStylers].forEach((menuBarStyler, index) => {
        new MenuBarStyler(menuBarStyler, index, stylerController);
      });
    }
    stylerController.shouldBeAltStyle();
  }

  const keenSliders = document.querySelectorAll('.green-air__slider');
  if (keenSliders != null) {
    [...keenSliders].forEach((slider, i) => {
      new Slider(slider);
    });
  }

  const splashImage = document.querySelector('.green-air__splash-image');
  if (splashImage != null) {
    new SplashImage(splashImage);
  }
});
