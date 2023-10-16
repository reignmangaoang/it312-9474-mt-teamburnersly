let type=""

function addIngredient(){
    var ingredienlist = document.getElementById("Ingredients")
    var ingredient = document.createElement("li")
    var input = document.createElement("INPUT")
    var trash = document.createElement("img")
    trash.src = ("images/Trash.png")
    trash.onclick = function(){
        trash.parentElement.parentElement.remove()
    }
    input.setAttribute("type","text")
    var div = document.createElement("div")
    div.setAttribute("class","inputObj")
    div.appendChild(input)
    div.appendChild(trash)
    ingredient.appendChild(div)
    ingredienlist.appendChild(ingredient)
}

function addStep(){
    var ingredienlist = document.getElementById("Steps")
    var ingredient = document.createElement("li")
    var input = document.createElement("INPUT")
    var trash = document.createElement("img")
    trash.src = ("images/Trash.png")
    trash.onclick = function(){
        trash.parentElement.parentElement.remove()
    }
    input.setAttribute("type","text")
    var div = document.createElement("div")
    div.setAttribute("class","inputObj")
    div.appendChild(input)
    div.appendChild(trash)
    ingredient.appendChild(div)
    ingredienlist.appendChild(ingredient)
}

function a(){
    var file = document.getElementById("myfile").files[0]
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        document.getElementById("prof").src=reader.result
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function changeToPork(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Pork"
    type="Pork"
}

function changeToChicken(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Chicken"
    type="Chicken"
}

function changeToDessert(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Dessert"
    type="Dessert"
}

function changeToBeef(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Beef"
    type="Beef"
}

function changeToVegetable(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Vegetable"
    type="Vegetable"
}

function changeToFish(){
    document.getElementById("choosenType").innerHTML = "Choosen Type: Fish"
    type="Fish"
}

function saveRecipe(){
    
}