document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-recipe-form");
    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");

    loadRecipes();

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("recipe-name").value.trim();
      const ingredients = document.getElementById("recipe-ingredients").value.trim();
      const prepTime = document.getElementById("prep-time").value;
      const steps = document.getElementById("prep-steps").value.trim();
      const imageInput = document.getElementById("recipe-image");

      if (!name || !ingredients || !prepTime || !steps) {
        alert("Please fill in all the fields!");
        return;
      }

      if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageURL = e.target.result;
          saveRecipe(name, ingredients, prepTime, steps, imageURL);
          form.reset();
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        saveRecipe(name, ingredients, prepTime, steps, "");
        form.reset();
      }
    });

    function saveRecipe(name, ingredients, prepTime, steps, imageURL) {
      let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      recipes.push({ name, ingredients, prepTime, steps, imageURL });
      localStorage.setItem("recipes", JSON.stringify(recipes));
      loadRecipes();
    }

    function loadRecipes() {
      recipeList.innerHTML = "";
      const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

      if (recipes.length === 0) {
        recipeList.innerHTML = "<p>No recipes found. Add some!</p>";
        return;
      }

      recipes.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
          <h3>${recipe.name}</h3>
          <p class="ingredients"><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p><strong>Prep Time:</strong> ${recipe.prepTime} min</p>
          <p><strong>Steps:</strong> ${recipe.steps}</p>
          ${recipe.imageURL ? `<img src="${recipe.imageURL}" alt="Recipe Image">` : ""}
          <button onclick="deleteRecipe(${index})">Delete</button>
        `;

        recipeList.appendChild(card);
      });
    }

    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      const recipes = document.querySelectorAll(".recipe-card");

      recipes.forEach((card) => {
        const name = card.querySelector("h3")?.innerText.toLowerCase() || "";
        const ingredients = card.querySelector(".ingredients")?.innerText.toLowerCase() || "";

        if (name.includes(query) || ingredients.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }