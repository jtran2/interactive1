function myFunction() {
        var person = prompt("Who are you?", "Harry Potter");
        
        if (person != null) {
            document.getElementById("demo").innerHTML =
            "Sup " + person + ". Let's go.";
        }
    }