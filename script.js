// Importar o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";


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
        push(giftsRef, {
            id: push(giftsRef).key, // Criar um ID único automaticamente
            name: giftName,
            reserved: false,
            reserver: '',
            imagePath: 'images/presente1.jpg'
        })
            .then(() => console.log("Presente adicionado com sucesso!"))
            .catch((error) => console.error("Erro ao adicionar presente:", error));
        document.getElementById("gift-name").value = ""; // Limpar campo
    } else {
        console.warn("Campo de presente vazio.");
    }
});


let snapshot;
let selectedGiftId = '';

// Atualizar lista de presentes em tempo real
onValue(giftsRef, (snapshot) => {
    const giftList = document.getElementById("gift-list");
    giftList.innerHTML = ""; // Limpar lista

    snapshot.forEach((childSnapshot) => {
        const gift = childSnapshot.val();
        const giftKey = childSnapshot.key; // Identificador único do presente

        const card = document.createElement("div");
        card.className = "col-6 col-sm-6 col-md-3 mb-3"; // Responsividade: 2 por linha no mobile, 4 por linha no desktop

        const giftCard = document.createElement("div");
        giftCard.className = "card h-100 custom-card";

        // Se o presente estiver reservado, aplica o filtro de preto e branco
        if (gift.reserved) {
            giftCard.style.filter = "grayscale(90%)"; // Aplica o efeito preto e branco
        }

        // Adicionar imagem ao card
        if (gift.imagePath) {
            const giftImage = document.createElement("img");
            giftImage.src = gift.imagePath; // Caminho da imagem salvo no banco
            giftImage.className = "card-img-top";
            giftImage.alt = gift.name;
            giftCard.appendChild(giftImage);
        }

        const giftBody = document.createElement("div");
        giftBody.className = "card-body";

        const giftName = document.createElement("h6");
        giftName.className = "card-title";
        giftName.textContent = gift.name;

        giftBody.appendChild(giftName);

        if (!gift.reserved) {
            const reserveButton = document.createElement("button");
            reserveButton.className = "btn btn-primary botao-reservar";
            reserveButton.textContent = "Reservar";

            // Lógica para exibir modal e capturar reserva
            reserveButton.addEventListener("click", () => {
                selectedGiftId = giftKey; // Salvar o ID do presente selecionado
                $('#reserveModal').modal('show'); // Mostrar o modal
            });

            giftBody.appendChild(reserveButton);
        } else {
            const reservedText = document.createElement("p");
            const reserverNameBold = document.createElement("b");
            reserverNameBold.textContent = gift.reserver;
            reservedText.textContent = "Reservado por ";
            reservedText.appendChild(reserverNameBold);
            giftBody.appendChild(reservedText);
        }

        giftCard.appendChild(giftBody);
        card.appendChild(giftCard);
        giftList.appendChild(card);
    });
});



// Confirmar reserva no modal
document.getElementById("confirm-reserve").addEventListener("click", () => {
    const reserverName = document.getElementById("reserver-name").value;

    if (reserverName.trim() && selectedGiftId) {
        const giftRef = ref(db, `gifts/${selectedGiftId}`);

        update(giftRef, { reserved: true, reserver: reserverName })
            .then(() => {
                console.log("Presente reservado com sucesso!");

                // Fechar o modal
                $('#reserveModal').modal('hide');

                // Exibir o alerta
                $('#reservaSucesso').modal('show');
            })
            .catch((error) => console.error("Erro ao reservar presente:", error));
    } else {
        console.warn("Nome do reservante ou ID do presente inválido.");
    }
});
