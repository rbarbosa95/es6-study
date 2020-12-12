import api from './api'
class App {
  constructor () {
    this.repositories = [];
    this.fromEl = document.querySelector('#repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.listEl = document.querySelector('#repo-list');
    this.registerHandlers();
  }

  registerHandlers() {
    this.fromEl.onsubmit = event => this.addRepository(event);
  }

  setLoading (loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement('div');
      loadingEl.setAttribute('id', 'loading');
      loadingEl.setAttribute('uk-spinner', '');

      this.fromEl.children[0].appendChild(loadingEl);
    } else {
      document.querySelector('#loading').remove();
    }
  }

  async addRepository (event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.length === 0) {
      return;
    }

    this.setLoading();

    try {
      const response = await api.get(`/repos/${repoInput}`);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;
  
      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url,
      });
  
      this.inputEl.value = '';
      this.render();
    } catch (error) {
      UIkit.notification({
        message: 'The repository does not exist!',
        status: 'danger',
        pos: 'top-center',
        timeout: 5000
      });
    }

    this.setLoading(false);
  }

  render () {
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {

      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);
      imgEl.setAttribute('alt', repo.name);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.appendChild(document.createTextNode('Acessar'));
      linkEl.setAttribute('href', repo.html_url);
      linkEl.setAttribute('class', 'uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom');

      let divElCustomInfos = document.createElement('div');
      divElCustomInfos.setAttribute('class', 'uk-custom-infos');
      divElCustomInfos.appendChild(titleEl);
      divElCustomInfos.appendChild(descriptionEl);
      divElCustomInfos.appendChild(linkEl);

      let listItemEl = document.createElement('li');
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(divElCustomInfos);

      this.listEl.appendChild(listItemEl);
    });
  }
}

new App();