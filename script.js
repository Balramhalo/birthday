document.getElementById("acha-btn").addEventListener("click", function() {
    document.getElementById("message").innerHTML = "Awww! 🤩 Tu bhi sundar hai! ❤️";
});

document.getElementById("bekar-btn").addEventListener("mouseover", function() {
    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 100);
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
});