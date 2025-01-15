// Importar o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";


// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDl7rmBizjf7SwuCobBcTrw38z8jsj0f5s",
    authDomain: "listapresentes-bc93b.firebaseapp.com",
    databaseURL: "https://listapresentes-bc93b-default-rtdb.firebaseio.com",
    projectId: "listapresentes-bc93b",
    storageBucket: "listapresentes-bc93b.firebasestorage.app",
    messagingSenderId: "724995747468",
    appId: "1:724995747468:web:2a5f6e019e83a7aa6495a9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const giftsRef = ref(db, "gifts");
// Adicionar presente ao banco de dados
document.getElementById("add-gift").addEventListener("click", () => {
    const giftName = document.getElementById("gift-name").value;
    if (giftName.trim()) {
        push(giftsRef, { name: giftName, reserved: false })
            .then(() => console.log("Presente adicionado com sucesso!"))
            .catch((error) => console.error("Erro ao adicionar presente:", error));
        document.getElementById("gift-name").value = ""; // Limpar campo
    } else {
        console.warn("Campo de presente vazio.");
    }
});



// Atualizar lista de presentes em tempo real
onValue(giftsRef, (snapshot) => {
    const giftList = document.getElementById("gift-list");
    giftList.innerHTML = ""; // Limpar lista
    snapshot.forEach((childSnapshot) => {
        const gift = childSnapshot.val();
        const li = document.createElement("li");
        li.textContent = gift.name;
        if (!gift.reserved) {
            const reserveButton = document.createElement("button");
            reserveButton.textContent = "Reservar";
            reserveButton.addEventListener("click", () => {
                const giftRef = ref(db, `gifts/${childSnapshot.key}`);
                update(giftRef, { reserved: true });
            });
            li.appendChild(reserveButton);
        } else {
            li.textContent += " (Reservado)";
        }
        giftList.appendChild(li);
    });
});