function addIngredient(){
    var ingredienlist = document.getElementById("Ingredients")
    var ingredient = document.createElement("li")
    var input = document.createElement("INPUT")
    var trash = document.createElement("img")
    trash.src = ("images/Trash.png")
    trash.onclick = function(){
        trash.parentElement.remove()
    }
    input.setAttribute("type","text")
    ingredient.appendChild(input)
    ingredient.appendChild(trash)
    ingredienlist.appendChild(ingredient)
}

function addStep(){
    var ingredienlist = document.getElementById("Steps")
    var ingredient = document.createElement("li")
    var input = document.createElement("INPUT")
    var trash = document.createElement("img")
    trash.src = ("images/Trash.png")
    trash.onclick = function(){
        trash.parentElement.remove()
    }
    input.setAttribute("type","text")
    ingredient.appendChild(input)
    ingredient.appendChild(trash)
    ingredienlist.appendChild(ingredient)
}