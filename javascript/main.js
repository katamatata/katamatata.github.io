let apiKey = "90b4bf234e22493e89325b6f9cce868e";
let numberOfResults = 1;

let randomRecipesUrl = "https://api.spoonacular.com/recipes/random?apiKey=" + apiKey;

let recipesByIngredientsUrl = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey;

let recipeFullInfoEndpointUrl = "https://api.spoonacular.com/recipes/";

let favouriteRecipesArray = [];

function getFavouriteRecipesArray() {
    let favouriteRecipes = localStorage.getItem('favouriteRecipes');
    if (favouriteRecipes !== null) {
        favouriteRecipesArray = JSON.parse(favouriteRecipes);
    }
}

function saveFavouriteRecipes() {
    localStorage.setItem('favouriteRecipes', JSON.stringify(favouriteRecipesArray));
}

function fillFavouriteRecipesDropdown() {
    getFavouriteRecipesArray();
    console.log(favouriteRecipesArray);
    if (favouriteRecipesArray.length > 0) {
        document.getElementById("dropdownInner").innerHTML = '';
        for (let recipe of favouriteRecipesArray) {
            let recipeEl = document.createElement('div');
            recipeEl.className = 'recipeListEl';
            document.getElementById("dropdownInner").appendChild(recipeEl);
            fillListItem(recipeEl, recipe);
        }
    } else {
        let favouritesPlaceholder = document.createElement('div');
        favouritesPlaceholder.className = 'favouritesPlaceholder';
        document.getElementById('dropdownInner').appendChild(favouritesPlaceholder);
        favouritesPlaceholder.innerHTML = "No favourite recipes yet";

    }
}

function showFavouriteRecipes() {
    document.getElementById('dropdown').style.display = 'block';
}

function hideFavouriteRecipes() {
    document.getElementById('dropdown').style.display = 'none';
}

function getNumberPerSearch() {
    return document.getElementById("resultsPerSearch").value;
}

async function onSearchClicked() {
    let userInput = document.getElementById("searchField").value;
    if (userInput === '') {
        return null;
    }
    let results = await searchRecipesByIngredients(userInput);
    showResults(results);
}

async function getRandomRecepies() {
    let url = randomRecipesUrl + "&number=" + numberOfResults;
    let response = await fetch(url);
    let recipeList = await response.json();
    return recipeList.recipes;
}

async function showRandomRecipes() {
    let results = await getRandomRecepies();
    showResults(results);
}

async function searchRecipesByIngredients(items) {
    let url = recipesByIngredientsUrl + "&number=" + numberOfResults + "&ingredients=" + encodeURIComponent(items);
    // console.log(url);
    let response = await fetch(url);
    let recipeList = await response.json();
    // console.log(recipeList);
    return recipeList;
}

function fillListItem(element, recipe) {
    let thumbnailImg = document.createElement('img');
    thumbnailImg.className = 'thumb';
    thumbnailImg.src = recipe.image;
    element.appendChild(thumbnailImg);

    let recipeInfoEl = document.createElement('div');
    recipeInfoEl.className = 'recipeListInfo';
    element.appendChild(recipeInfoEl);

    let recipeName = document.createElement('h2');
    recipeName.className = 'recipeListName';
    recipeName.textContent = recipe.title;
    recipeInfoEl.appendChild(recipeName);
}

function showResults(recipeList) {
    clearResults();
    clearRecipe();

    console.log(recipeList);

    let allElements = [];

    for (let i = 0; i < recipeList.length; i++) {
        let recipeEl = document.createElement('div');
        recipeEl.className = 'recipeListEl';

        allElements.push(recipeEl);
        recipeEl.onclick = function () {
            showRecipe(recipeList[i]);

            for (let el of allElements) {
                el.classList.remove('selected');
            }

            recipeEl.classList.add('selected');
        }

        document.getElementById("recipeListSection").appendChild(recipeEl);
        fillListItem(recipeEl, recipeList[i])
    }
    allElements[0].classList.add('selected');
    showRecipe(recipeList[0]);

}

function clearResults() {
    let clearResults = document.getElementById("recipeListSection");
    clearResults.innerHTML = "";
}

async function getRecipeFullInfo(item) {
    let url = recipeFullInfoEndpointUrl + item + "/information?includeNutrition=true&apiKey=" + apiKey;
    let response = await fetch(url);
    let recipeInfo = await response.json();
    return recipeInfo;
}

async function showRecipe(recipe) {
    clearRecipe();

    let recipeFullInfo = await getRecipeFullInfo(recipe.id);

    let bigImgWrapper = document.createElement('div');
    bigImgWrapper.className = 'img-wrapper';
    bigImgWrapper.style.backgroundImage = 'url(' + recipeFullInfo.image + ')';
    document.getElementById("recipeSection").appendChild(bigImgWrapper);

    let recipeName = document.createElement('h2');
    recipeName.className = 'recipeName';
    recipeName.textContent = recipeFullInfo.title;
    bigImgWrapper.appendChild(recipeName);

    let recipeInfoEl = document.createElement('div');
    recipeInfoEl.className = 'recipeInfo';
    document.getElementById("recipeSection").appendChild(recipeInfoEl);

    let iconsWrapper = document.createElement('div');
    iconsWrapper.className = 'iconsWrapper';
    recipeInfoEl.appendChild(iconsWrapper);

    let servingsEl = document.createElement('div');
    servingsEl.className = 'servingsEl';
    iconsWrapper.appendChild(servingsEl);

    let utensilsIcon = document.createElement('i');
    utensilsIcon.className = 'fas fa-utensils';
    servingsEl.appendChild(utensilsIcon);

    let servings = document.createElement('span');
    servings.className = 'servings';
    if (recipeFullInfo.servings === 1) {
        servings.textContent = recipeFullInfo.servings + ' serving';
    } else {
        servings.textContent = recipeFullInfo.servings + ' servings';
    }
    servingsEl.appendChild(servings);

    let cookingTimeEl = document.createElement('div');
    cookingTimeEl.className = 'cookingTimeEl';
    iconsWrapper.appendChild(cookingTimeEl);

    let clockIcon = document.createElement('i');
    clockIcon.className = 'far fa-clock';
    cookingTimeEl.appendChild(clockIcon);

    let cookingTime = document.createElement('span');
    cookingTime.className = 'cookingTime';
    cookingTime.textContent = recipeFullInfo.readyInMinutes + ' min';
    cookingTimeEl.appendChild(cookingTime);

    let isRecipeFavourite = false;

    for (let i = 0; i < favouriteRecipesArray.length; i++) {
        if (recipe.id === favouriteRecipesArray[i].id) {
            isRecipeFavourite = true;
        }
    }

    let heartEl = document.createElement('div');
    heartEl.className = 'heartEl';
    iconsWrapper.appendChild(heartEl);
    let heartIcon = document.createElement('i');
    let addToFavourites = document.createElement('span');

    if (isRecipeFavourite) {
        heartIcon.className = 'fas fa-heart';
        addToFavourites.textContent = 'saved to favourites';
        heartEl.onclick = undefined;
        heartEl.style.cursor = 'default';
    } else {
        heartIcon.className = 'far fa-heart';
        addToFavourites.textContent = 'add to favourites';
        heartEl.onclick = function () {
            favouriteRecipesArray.push(recipe);
            heartIcon.className = 'fas fa-heart';
            addToFavourites.textContent = 'saved to favourites';
            heartEl.onclick = undefined;
            heartEl.style.cursor = 'default';
            saveFavouriteRecipes();
            fillFavouriteRecipesDropdown();
        }
    }

    heartEl.appendChild(heartIcon);
    heartEl.appendChild(addToFavourites);


    let infoWrapper = document.createElement('div');
    infoWrapper.className = 'infoWrapper';
    recipeInfoEl.appendChild(infoWrapper);

    let ingredientsWrapper = document.createElement('div');
    ingredientsWrapper.className = 'ingredientsWrapper';
    infoWrapper.appendChild(ingredientsWrapper);

    let ingredientsWrapperName = document.createElement('p');
    ingredientsWrapperName.className = 'ingredientsWrapperName';
    ingredientsWrapperName.textContent = 'Ingredients:';
    ingredientsWrapper.appendChild(ingredientsWrapperName);

    let ingredientsEl = document.createElement('ul');
    ingredientsEl.className = 'ingredientsEl';
    ingredientsWrapper.appendChild(ingredientsEl);

    for (let i = 0; i < recipeFullInfo.extendedIngredients.length; i++) {
        let ingredient = document.createElement('li');
        ingredient.textContent = recipeFullInfo.extendedIngredients[i].original;
        ingredientsEl.appendChild(ingredient);
    }

    let instructionsWrapper = document.createElement('div');
    instructionsWrapper.className = 'instructionsWrapper';
    infoWrapper.appendChild(instructionsWrapper);

    let instructionsWrapperName = document.createElement('p');
    instructionsWrapperName.className = 'instructionsWrapperName';
    instructionsWrapperName.textContent = 'Preparation:';
    instructionsWrapper.appendChild(instructionsWrapperName);

    let instructionsEl = document.createElement('p');
    instructionsEl.className = 'instructionsEl';
    instructionsEl.textContent = recipeFullInfo.instructions;
    instructionsWrapper.appendChild(instructionsEl);
}

function clearRecipe() {
    let clearResults = document.getElementById("recipeSection");
    clearResults.innerHTML = "";
    // console.log(clearResults);
}

document.getElementById('heart').onclick = function () {
    fillFavouriteRecipesDropdown();
    showFavouriteRecipes();
}

document.getElementById('layer').onclick = function () {
    hideFavouriteRecipes();
}

showRandomRecipes();
