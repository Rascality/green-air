const version = 4;
console.log(`Loaded Green Air JS – Version: ${version}`);
//
// Classes and Functions
//
class ProjectsList {
  projectsListView = null;
  projectsGridView = null;
  projectsGridViewControl = null;
  projectsListViewControl = null;

  projectListFilter = null;

  projects = [];

  constructor() {
    console.log('ProjectsList – Constructor');
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
    console.log('ProjectsList – initialiseProjects');
    this.projectsListView = document.querySelector('.green-air__projects__listview');
    this.projectsGridView = document.querySelector('.green-air__projects__gridview');
  }

  initialiseControls() {
    console.log('ProjectsList – initialiseControls');
    // Toggle the view controls.
    this.projectsGridViewControl = document.querySelector('.green-air__filter__icon__block');
    this.projectsListViewControl = document.querySelector('.green-air__filter__icon__list');

    if (this.projectsGridViewControl != null) {
      this.projectsGridViewControl.addEventListener('click', () => {
        console.log('Clicked – GridView');
        this.gridView();
      });
    }

    if (this.projectsListViewControl != null) {
      this.projectsListViewControl.addEventListener('click', () => {
        console.log('Clicked – ListView');
        this.listView();
      });
    }
  }

  gridView() {
    console.log('Showing Grid View');
    this.projectsListView.classList.add('hidden');
    this.projectsListViewControl.classList.add('deselected');
    this.projectsGridView.classList.remove('hidden');
    this.projectsGridViewControl.classList.remove('deselected');

  }

  listView() {
    console.log('Showing List View');
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
    console.log("Filter:", this.projects);
    console.log("ProjectTypes:", projectType);
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
      console.log(this.projectFilters);
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

    let allSlides = [...element.querySelectorAll('.js__green-air__hover-carousel__slide')];
    for (let i = 0; i < allSlides.length; i += 1) {
      let slide = allSlides[i];
      let src = slide.getAttribute("src");
      if (src != null && src.trim().length !== 0) {
        this.slides.push(slide);
      } else {
        slide.remove();
      }
    }
    this.mainSlide = this.slides[0];

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

  startRotatingSlides() {
    console.log("Start Rotating Slides?");
    clearInterval(this.rotationInterval);
    this.rotationInterval = setInterval(() => {
      this.changeSlide();
    }, 2500);
  }

  setSlideSizes() {
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
    console.log(`Changing from slide ${prevIndex} to ${this.currentSlideIndex}`);
    currentSlide.classList.remove('inactive-slide');
    prevSlide.classList.add('inactive-slide');
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
    this.target = target;
  }
}

//
// On Load
//
window.addEventListener("load", (event) => {
  console.log("Starting Script");
  const projectsContainer = document.querySelector('.green-air__projects__container');
  if (projectsContainer != null) {
    console.log("Creating ProjectsList");
    const projectsList = new ProjectsList();
    console.log(projectsList);
  }

  console.log('Loading Hover Carousels');
  const hoverCarousels = document.querySelectorAll('.js__green-air__hover-carousel');
  if (hoverCarousels != null) {
    [...hoverCarousels].forEach((hoverCarousel, i) => {
      new HoverCarousel(hoverCarousel);
    });
  }
});
