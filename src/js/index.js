import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';


/*  GLOBAL state of the app

-   Search Object
-   Current recipe object
-   Shopping list object
-   Liked recipes
*/

const state = {};

//SEARCH CONTROLLER
const controlSearch =async () => {
    //1.    Get the query from the view
        const query = searchView.getInput();

    if(query){
        //2.    New search object and add to the state
        state.search = new Search(query);

        //3.    Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4.    Search for recipes
            await state.search.getResults();
            
            //5.    Render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
            
        } catch (error) {
            console.log(error);
            alert(`Something went wrong with the 😶 `);
            clearLoader();

        }
    }

}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchRes.addEventListener('click',e => {
    
    const btn = e.target.closest('.btn-inline');
    
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);        
    }

});




//RECIPE CONTROLLER
const controlRecipe = async () => {
    // 1. Get the ID from the URL
    const id = window.location.hash.replace('#','');
    console.log(id); 

    if(id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight Selected search item

        if(state.search) searchView.highlightSelected(id);

        // Create new Recipe Object
        state.recipe = new Recipe(id);

       
        try {
            // Get recipe object and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch (err) {
            console.log(err);
            alert(`Error Processing Recipe 😢`);
        }
    
    }

};


['hashchange','load'].forEach( event => window.addEventListener(event, controlRecipe));

//HANDLING RECIPE BUTTON CLICKS

elements.recipe.addEventListener('click',e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});


