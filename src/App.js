import React, { Component, Fragment } from 'react';
import { Panel, PanelGroup, Button, ButtonToolbar, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import './App.css';

class App extends Component {
  // State de notre composant

  state = {
    recipes: [],
    showAdd: false,
    showEdit: false,
    currentIndex: 0,
    newestRecipe: { recipeName: '', ingredients: [] }
  };

  // Function : 

  // Supprimer une recette
  deleteRecipe(index) {
    // take copy of state to not mutate original
    let recipes = this.state.recipes.slice();
    // delete out just the indexed instance
    recipes.splice(index, 1);
    // async call that sets the state of recipes to what's in local storage
    localStorage.setItem('recipes', JSON.stringify(recipes));
    // afficher l'etat
    this.setState({ recipes });
  }

  // modifer la nouvelle Recette
  updateNewRecipe(recipeName, ingredients) {
    this.setState({
      newestRecipe: {
        recipeName: recipeName,
        ingredients: ingredients
      }
    });
  }

  // Sauvgarder la nouvelle recette
  saveNewRecipe() {
    // prendre une copie d'etat pour eviter mutation lors de notre ajout.
    let recipes = this.state.recipes.slice();
    // ajouter la rectte dans le dernier emplacement
    if (this.state.newestRecipe.recipeName) {
      recipes.push({
        recipeName: this.state.newestRecipe.recipeName,
        ingredients: this.state.newestRecipe.ingredients
      });
    }
    localStorage.setItem('recipes', JSON.stringify(recipes));
    // afficher l'etat
    this.setState({ recipes });
    // faire reset de nos valeur.
    this.setState({ newestRecipe: { recipeName: '', ingredients: [] } });
    this.close();
  }

  // Modifier le nom de notre recette
  updateRecipeName(recipeName, currentIndex) {
   // prendre une copie d'etat pour eviter mutation lors de notre ajout.
    let recipes = this.state.recipes.slice();
    recipes[currentIndex] = { recipeName: recipeName, ingredients: recipes[currentIndex].ingredients };

    localStorage.setItem('recipes', JSON.stringify(recipes))
    this.setState({ recipes });
  }

  // Modifier les ingredients de notre recette
  updateIngredients(ingredients, currentIndex) {
    // prendre une copie d'etat pour eviter mutation lors de notre ajout.
    let recipes = this.state.recipes.slice();
    recipes[currentIndex] = { recipeName: recipes[currentIndex].recipeName, ingredients: ingredients };
    localStorage.setItem('recipes', JSON.stringify(recipes));
    // afficher l'etat
    this.setState({ recipes });
  }

  open = (state, currentIndex) => {
    this.setState({ [state]: true });
    this.setState({ currentIndex });
  };

  close = () => {
    if (this.state.showAdd) {
      this.setState({ showAdd: false });
    }
    if (this.state.showEdit) {
      this.setState({ showEdit: false });
    }
  };


  componentDidMount() {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    // afficher l'etat
    this.setState({ recipes });
  }

  //Affichage

  render() {
    const { recipes, newestRecipe, currentIndex } = this.state;

    return (
      <div className="App container">
        <div className="top-title">
          <h1 className="main-title"> My Recipe Box </h1>
          <Button bsStyle="primary" className="addBtn" onClick={event => this.open('showAdd', currentIndex)}>
            +
          </Button>
        </div>

        {recipes.length == 0 && (
          <Fragment>
            <h3> Add a recipe by clicking the button above! </h3>
          </Fragment>
        )}

        {recipes.length > 0 && (
          <Fragment>
            <PanelGroup accordion id="a">
              {recipes.map((recipe, index) => (
                <Panel eventKey={index} key={index} className="center-block">
                  <Panel.Heading>
                    <Panel.Title toggle>{recipe.recipeName}</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <ul>{recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
                    <ButtonToolbar>
                      <Button bsStyle="default" onClick={event => this.open('showEdit', index)}>
                        edit
                      </Button>
                      <Button bsStyle="danger" onClick={event => this.deleteRecipe(index)}>
                        delete
                      </Button>
                    </ButtonToolbar>
                  </Panel.Body>
                </Panel>
              ))}
            </PanelGroup>

            <Modal show={this.state.showEdit} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>

                <Modal.Body>
                  <FormGroup controlId="formBasicText">
                    <ControlLabel>
                      {' '}
                      Recipe Name{' '}
                      <FormControl
                        type="text"
                        value={recipes[currentIndex].recipeName}
                        placeholder="Enter text"
                        onChange={event => this.updateRecipeName(event.target.value, currentIndex)}
                      />
                    </ControlLabel>
                  </FormGroup>
                  <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>
                      {' '}
                      Ingredients{' '}
                      <FormControl
                        type="textarea"
                        value={recipes[currentIndex].ingredients}
                        placeholder="Enter Ingredients (separate by commas)"
                        onChange={event => this.updateIngredients(event.target.value.split(','), currentIndex)}
                      />
                    </ControlLabel>
                  </FormGroup>
                </Modal.Body>

                <Modal.Footer>
                  <Button bsStyle="primary" onClick={event => this.saveNewRecipe()}>
                    Save Edit
                  </Button>
                </Modal.Footer>
              </Modal.Header>
            </Modal>
          </Fragment>
        )}
        <Modal show={this.state.showAdd} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Recipe</Modal.Title>

            <Modal.Body>

              <FormGroup controlId="formBasicText">
                <ControlLabel>
                  {' '}
                  Recipe Name{' '}
                  <FormControl
                    type="text"
                    value={newestRecipe.recipeName}
                    placeholder="Enter Recipe Name"
                    onChange={event => this.updateNewRecipe(event.target.value, newestRecipe.ingredients)}
                  />
                </ControlLabel>
              </FormGroup>

              <FormGroup controlId="formControlsTextarea">
                <ControlLabel>
                  {' '}
                  Ingredients{' '}
                  <FormControl
                    type="textarea"
                    value={newestRecipe.ingredients}
                    placeholder="Enter Ingredients (separate by commas)"
                    onChange={event => this.updateNewRecipe(newestRecipe.recipeName, event.target.value.split(','))}
                  />
                </ControlLabel>
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button bsStyle="primary" onClick={event => this.saveNewRecipe()}>
                Save
              </Button>
            </Modal.Footer>
          </Modal.Header>
        </Modal>
      </div>
    );
  }
}

export default App;
