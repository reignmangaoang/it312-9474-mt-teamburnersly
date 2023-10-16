async function initializeRecipe(id){
    var recipe = await getRecipeById(id) 
    var chosenUser = await getUserById(recipe.recipeAuthor)
    document.getElementById("recImg").src = recipe.recipePicture
    document.getElementById("titleText").innerHTML = recipe.recipeName
    document.getElementById("type").firstElementChild.nextElementSibling.innerHTML = recipe.recipeType
    document.getElementsByClassName("recipeCreator")[0].firstElementChild.src = chosenUser.profilePic
    document.getElementsByClassName("recipeCreator")[0].firstElementChild.nextElementSibling.innerHTML = chosenUser.firstName+" "+chosenUser.lastName
    document.getElementsByClassName("recipeDesc")[0].firstElementChild.innerHTML = recipe.recipeDesc
    var allTime = recipe.recipeDuration
    var timeText = "Prep Time: "+(allTime[0]/60)+" min | Cook time: "+(allTime[1]/60)+" | Total: "+((allTime[0]/60)+(allTime[1]/60))+" min"
    document.getElementsByClassName("recipeTime")[0].firstElementChild.nextElementSibling.innerHTML=timeText
    var ingredienlist = document.getElementsByClassName("ingredients")[0].firstElementChild.nextElementSibling
    for (var i=0;i<recipe.ingredients.length;i++){
        var ingredient = document.createElement("li")
        ingredient.appendChild(document.createTextNode(recipe.ingredients[i]))
        ingredienlist.appendChild(ingredient)
    }
    var steps = document.getElementsByClassName("steps")[0].firstElementChild.nextElementSibling
    for (var i=0;i<recipe.steps.length;i++){
        var step = document.createElement("li")
        step.appendChild(document.createTextNode(recipe.steps[i]))
        steps.appendChild(step)
    }
}
initializeRecipe(sessionStorage.getItem("choosenRecipe"))