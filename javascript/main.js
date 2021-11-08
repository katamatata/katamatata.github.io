const apiKey = "90b4bf234e22493e89325b6f9cce868e";
const numberOfResults = 10;

const randomRecipesEndpoint = "https://api.spoonacular.com/recipes/random?apiKey=" + apiKey;

const recipesByIngredientsEndpoint = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey;

const recipeFullInfoEndpoint = "https://api.spoonacular.com/recipes/";

let favouriteRecipesArray = [];

const getFavouriteRecipesArray = () => {
    const favouriteRecipes = localStorage.getItem('favouriteRecipes');
    if (favouriteRecipes !== null) {
        favouriteRecipesArray = JSON.parse(favouriteRecipes);
    }
}

const saveFavouriteRecipes = () => {
    localStorage.setItem('favouriteRecipes', JSON.stringify(favouriteRecipesArray));
}

const fillFavouriteRecipesDropdown = () => {
    getFavouriteRecipesArray();
    //console.log(favouriteRecipesArray);
    document.getElementById("dropdownInner").innerHTML = '';
    if (favouriteRecipesArray.length > 0) {
        for (let recipe of favouriteRecipesArray) {
            const recipeEl = document.createElement('div');
            recipeEl.className = 'recipeListEl';
            document.getElementById("dropdownInner").appendChild(recipeEl);
            fillListItem(recipeEl, recipe);
        }
    } else {
        const favouritesPlaceholder = document.createElement('div');
        favouritesPlaceholder.className = 'favouritesPlaceholder';
        document.getElementById('dropdownInner').appendChild(favouritesPlaceholder);
        favouritesPlaceholder.innerHTML = "No favourite recipes yet";

    }
}

const showFavouriteRecipes = () => {
    document.getElementById('dropdown').style.display = 'block';
}

const hideFavouriteRecipes = () => {
    document.getElementById('dropdown').style.display = 'none';
}

const getNumberPerSearch = () => {
    return document.getElementById("resultsPerSearch").value;
}

const onSearchClicked = async () => {
    const userInput = document.getElementById("searchField").value;
    if (userInput === '') {
        return null;
    }
    const results = await searchRecipesByIngredients(userInput);
    showResults(results);
}

const getRandomRecepies = async () => {
    const randomRecipesUrl = randomRecipesEndpoint + "&number=" + numberOfResults;
    const responseRandomRecipes = await fetch(randomRecipesUrl);
    const recipeListRandom = await responseRandomRecipes.json();
    return recipeListRandom.recipes;
}

const showRandomRecipes = async () => {
    const results = await getRandomRecepies();
    showResults(results);
}

const searchRecipesByIngredients = async (items) => {
    const recipesByIngredientsUrl = recipesByIngredientsEndpoint + "&number=" + numberOfResults + "&ingredients=" + encodeURIComponent(items);
    const responseRecipesByIngredients = await fetch(recipesByIngredientsUrl);
    const recipeListByIngredients = await responseRecipesByIngredients.json();
    return recipeListByIngredients;
}

const fillListItem = (element, recipe) => {
    const thumbnailImg = document.createElement('img');
    thumbnailImg.className = 'thumb';
    thumbnailImg.src = recipe.image;
    element.appendChild(thumbnailImg);

    const recipeInfoEl = document.createElement('div');
    recipeInfoEl.className = 'recipeListInfo';
    element.appendChild(recipeInfoEl);

    const recipeName = document.createElement('h2');
    recipeName.className = 'recipeListName';
    recipeName.textContent = recipe.title;
    recipeInfoEl.appendChild(recipeName);
}

const showResults = (recipeList) => {
    clearResults();
    clearRecipe();

    // console.log(recipeList);

    const allElements = [];

    for (let i = 0; i < recipeList.length; i++) {
        const recipeEl = document.createElement('div');
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
        fillListItem(recipeEl, recipeList[i]);
    }
    allElements[0].classList.add('selected');
    showRecipe(recipeList[0]);

}

const clearResults = () => {
    const clearResults = document.getElementById("recipeListSection");
    clearResults.innerHTML = "";
}

const getRecipeFullInfo = async (item) => {
    const recipeFullInfoUrl = recipeFullInfoEndpoint + item + "/information?includeNutrition=true&apiKey=" + apiKey;
    const responserecipeFullInfo = await fetch(recipeFullInfoUrl);
    const recipeInfo = await responserecipeFullInfo.json();
    return recipeInfo;
}

const showRecipe = async (recipe) => {
    clearRecipe();

    const recipeFullInfo = await getRecipeFullInfo(recipe.id);

    const bigImgWrapper = document.createElement('div');
    bigImgWrapper.className = 'img-wrapper';
    bigImgWrapper.style.backgroundImage = 'url(' + recipeFullInfo.image + ')';
    document.getElementById("recipeSection").appendChild(bigImgWrapper);

    const recipeName = document.createElement('h2');
    recipeName.className = 'recipeName';
    recipeName.textContent = recipeFullInfo.title;
    bigImgWrapper.appendChild(recipeName);

    const recipeInfoEl = document.createElement('div');
    recipeInfoEl.className = 'recipeInfo';
    document.getElementById("recipeSection").appendChild(recipeInfoEl);

    const iconsWrapper = document.createElement('div');
    iconsWrapper.className = 'iconsWrapper';
    recipeInfoEl.appendChild(iconsWrapper);

    const servingsEl = document.createElement('div');
    servingsEl.className = 'servingsEl';
    iconsWrapper.appendChild(servingsEl);

    const utensilsIcon = document.createElement('i');
    utensilsIcon.className = 'fas fa-utensils';
    servingsEl.appendChild(utensilsIcon);

    const servings = document.createElement('span');
    servings.className = 'servings';
    if (recipeFullInfo.servings === 1) {
        servings.textContent = recipeFullInfo.servings + ' serving';
    } else {
        servings.textContent = recipeFullInfo.servings + ' servings';
    }
    servingsEl.appendChild(servings);

    const cookingTimeEl = document.createElement('div');
    cookingTimeEl.className = 'cookingTimeEl';
    iconsWrapper.appendChild(cookingTimeEl);

    const clockIcon = document.createElement('i');
    clockIcon.className = 'far fa-clock';
    cookingTimeEl.appendChild(clockIcon);

    const cookingTime = document.createElement('span');
    cookingTime.className = 'cookingTime';
    cookingTime.textContent = recipeFullInfo.readyInMinutes + ' min';
    cookingTimeEl.appendChild(cookingTime);

    let isRecipeFavourite = false;

    for (let i = 0; i < favouriteRecipesArray.length; i++) {
        if (recipe.id === favouriteRecipesArray[i].id) {
            isRecipeFavourite = true;
        }
    }

    const heartEl = document.createElement('div');
    heartEl.className = 'heartEl';
    iconsWrapper.appendChild(heartEl);
    const heartIcon = document.createElement('i');
    const addToFavourites = document.createElement('span');

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


    const infoWrapper = document.createElement('div');
    infoWrapper.className = 'infoWrapper';
    recipeInfoEl.appendChild(infoWrapper);

    const ingredientsWrapper = document.createElement('div');
    ingredientsWrapper.className = 'ingredientsWrapper';
    infoWrapper.appendChild(ingredientsWrapper);

    const ingredientsWrapperName = document.createElement('p');
    ingredientsWrapperName.className = 'ingredientsWrapperName';
    ingredientsWrapperName.textContent = 'Ingredients:';
    ingredientsWrapper.appendChild(ingredientsWrapperName);

    const ingredientsEl = document.createElement('ul');
    ingredientsEl.className = 'ingredientsEl';
    ingredientsWrapper.appendChild(ingredientsEl);

    for (let i = 0; i < recipeFullInfo.extendedIngredients.length; i++) {
        const ingredient = document.createElement('li');
        ingredient.textContent = recipeFullInfo.extendedIngredients[i].original;
        ingredientsEl.appendChild(ingredient);
    }

    const instructionsWrapper = document.createElement('div');
    instructionsWrapper.className = 'instructionsWrapper';
    infoWrapper.appendChild(instructionsWrapper);

    const instructionsWrapperName = document.createElement('p');
    instructionsWrapperName.className = 'instructionsWrapperName';
    instructionsWrapperName.textContent = 'Preparation:';
    instructionsWrapper.appendChild(instructionsWrapperName);

    const instructionsEl = document.createElement('p');
    instructionsEl.className = 'instructionsEl';
    instructionsEl.textContent = recipeFullInfo.instructions;
    instructionsWrapper.appendChild(instructionsEl);
}

const clearRecipe = () => {
    const clearResults = document.getElementById("recipeSection");
    clearResults.innerHTML = "";
}

document.getElementById('heart').onclick = function () {
    fillFavouriteRecipesDropdown();
    showFavouriteRecipes();
}

document.getElementById('layer').onclick = function () {
    hideFavouriteRecipes();
}

showRandomRecipes();