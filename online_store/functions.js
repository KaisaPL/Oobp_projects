function cartUpdate() {
    document.querySelector(".cartCounter").innerText = shoppingCartArray.length
    let cartItems = document.querySelector("#cartItems")
    if (shoppingCartArray.length == 0) {
        cartItems.innerText = "Shopping cart is empty!"
    } else {
        cartItems.innerHTML = ''
        var totalPrice = 0
        shoppingCartArray.forEach(element => {
            var newElement = document.createElement("div")
                newElement.className = "cartContent"
                    var img = document.createElement("img")
                    img.src = element.image
                    var newName = document.createElement("span")
                    newName.innerText = element.name
                    var newPrice = document.createElement("span")
                    newPrice.innerText = element.price + " €"
                    newElement.appendChild(img)
                    newElement.appendChild(newName)
                    newElement.appendChild(newPrice)
                    totalPrice += Number(element.price)
                cartItems.appendChild(newElement)
        })
        document.querySelector(".totalPrice").innerText = "Total price: " +totalPrice+ " Souls"
    }
}

function DetailView(index) {
    $.getJSON("./products.json", function(jsonFile) {

        document.querySelector("#mainPage").innerHTML = ''

        var newDetailView = document.createElement("div")
        newDetailView.id = "detailView"
        document.querySelector("#mainPage").appendChild(newDetailView)

        let details = document.querySelector("#detailView")

        var forImgAndButton = document.createElement("div")
        forImgAndButton.className = "imgAndButton"
        details.appendChild(forImgAndButton)

            var imgBox = document.createElement("div")
            imgBox.className = "imgBox"
            forImgAndButton.appendChild(imgBox)

            var newImage = document.createElement("img");
            newImage.src = jsonFile[index].image
            imgBox.appendChild(newImage)

            var newButton = document.createElement("button")
            newButton.className = "detailButton"
            newButton.innerText = "Add to cart"
            newButton.onclick = function() {
                shoppingCartArray.push(jsonFile[index])
                cartUpdate()
            }
            forImgAndButton.appendChild(newButton)

        var description = document.createElement("div")
        description.className = "description"
        details.appendChild(descriptionBox)

            var newName = document.createElement("span")
            newName.className = "name"
            newName.innerText = jsonFile[index].name;
            description.appendChild(newName)

            var descriptions = document.createElement("span")
            descriptions.className = "description"
            descriptions.innerText = jsonFile[index].description
            description.appendChild(descriptions)

            var newPrice = document.createElement("span")
            newPrice.className = "price"
            newPrice.innerText = "Price: " + jsonFile[index].price + " €";
            description.appendChild(newPrice)

    });
}

function allProductsInGrid() {
    $.getJSON("./products.json", function(jsonFile) {

        document.querySelector("#mainPage").innerHTML = ''

        var newGrid = document.createElement("div")
        newGrid.id = "allProducts"
        document.querySelector("#mainPage").appendChild(newGrid)

        jsonFile.forEach(element => {
            var newProduct = document.createElement("div");
            newProduct.className = "product";
            document.querySelector("#allProducts").appendChild(newProduct)
        });

        document.querySelectorAll(".product").forEach((element, index) => {
            var newImage = document.createElement("img");
            newImage.src = jsonFile[index].image
            element.appendChild(newImage)

            var newName = document.createElement("span")
            newName.innerText = jsonFile[index].name;
            element.appendChild(newName)

            var newPrice = document.createElement("span")
            newPrice.innerText = jsonFile[index].price + "€";
            element.appendChild(newPrice)

            element.onclick = function() {DetailView(index)}
        });
    });
}

function pageReload() {
    window.location.reload()
}