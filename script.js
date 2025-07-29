const listEle = document.querySelectorAll(".recipe-item");
const recipeListEle = document.getElementById("recipe-list");

init();

function getIngredientsText(recipe) {
    let ingredientsText = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientsText += `${ingredient} - ${measure ? measure.trim() : ""}, `;
        }
    }

    // Remove the last comma and space
    return ingredientsText.replace(/, $/, "");
}


function displayRecipes(recipes) {
    recipeListEle.innerHTML = "";

    recipes.forEach((recipe) => {
        const recipeItemEle = document.createElement("li");  // create li
        recipeItemEle.classList.add("recipe-item"); // add class for style

        const recipeImageEle = document.createElement("img");  // crate img tag
        recipeImageEle.src = recipe.strMealThumb || "";        // add src in img
        recipeImageEle.alt = recipe.strMeal || "Recipe image";  // add alt in img
        recipeItemEle.appendChild(recipeImageEle);   // apend img to li

        const recipeNameEle = document.createElement("h2");  // create h2
        recipeNameEle.textContent = recipe.strMeal;  // add title
        recipeItemEle.appendChild(recipeNameEle); // apend title into li

        const recipeIngredientsEle = document.createElement("p");  // create paragraph
        recipeIngredientsEle.innerHTML = `<strong>Ingredients:</strong> ${getIngredientsText(recipe)}`; // ✅ Use the separate function
        recipeItemEle.appendChild(recipeIngredientsEle);  // append p into li

        const recipeLinkEle = document.createElement("a"); // create anchor tag
        recipeLinkEle.href = recipe.strYoutube; // add video link
        recipeLinkEle.innerText = "Watch Video"; // add text 
        recipeItemEle.appendChild(recipeLinkEle);// append a into li

        recipeListEle.appendChild(recipeItemEle);  // apend li to ul
    });
}


async function getAllRecipes() {
    const menu = [];

    for (let i = 97; i <= 122; i++) { // ASCII codes for a-z
        const letter = String.fromCharCode(i);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        
        if (data.meals) {
            menu.push(...data.meals); // Spread into the main list
        }
    }

    return menu;
}

async function init() {
    const loadingText = document.getElementById("loading");
    loadingText.style.display = "block";   // Show "Loading..." text
    recipeListEle.style.display = "none";  // Hide recipe list while loading

    const recipes = await getAllRecipes();

    loadingText.style.display = "none";    // Hide loading text
    recipeListEle.style.display = "block"; // Show recipe list
    
    displayRecipes(recipes);


    // console.log(recipes);                 // ✅ this is now an array (not a Promise)
    // const firstMeal = recipes[0];
    // console.log(firstMeal);               // ✅ access the first object
}

