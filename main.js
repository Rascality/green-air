const version = 2;
console.log(`Loaded Green Air JS – Version: ${version}`);
//
// Classes and Functions
//
class ProjectsList {
  projectsListView = null;
  projectsGridView = null;
  projectsGridViewControl = null;
  projectsListViewControl = null;

  constructor() {
    console.log('ProjectsList – Constructor');
    this.gridView = this.gridView.bind(this);
    this.listView = this.listView.bind(this);

    // Load the projects lists.
    this.initialiseProjects();
    this.initialiseControls();
  }

  initialiseProjects() {
    console.log('ProjectsList – initialiseProjects');
    this.projectsListView = document.querySelector('.green-air__projects__listview');
    this.projectsGridView = document.querySelector('.green-air__projects__gridview');
    this.gridView();
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
    this.projectsGridView.classList.remove('hidden');
  }

  listView() {
    console.log('Showing List View');
    this.projectsGridView.classList.add('hidden');
    this.projectsListView.classList.remove('hidden');
  }
}
//
// On Load
//
const projectsContainer = document.querySelector('.green-air__projects__container');
if (projectsContainer != null) {
  const projectsList = new ProjectsList();
}
