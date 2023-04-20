// Pegar a lista de objetos das pizzas e mapear para busca-las.

// Essa função abaixo, é para deixar mais simples o processo de usar o "querySelector" para ficar adicionando itens, pois vai ser muito usado.
// Então, invés de escrever todo o document, apenas vamos usar "c".
const c = (el) => {
  return document.querySelector(el);
};
const cs = (el) => {
  return document.querySelectorAll(el);
};

// Váriavel para armazenar a quantidade de pizzas selecionadas.
let modalQt = 1;

// Váriavel lista, do carrinho de compras.
let cart = [];

// Váriavel para armazenar itens do modal no carrinho
let modalKey = 0;

// Listagem das pizzas:
pizzaJson.map((item, index) => {
  // Vamos pegar(clonar) a estrutura models do html, pegar o clone, preencher e apresentar na tela.

  // Clonando:
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  // Apresentando:
  c(".pizza-area").append(pizzaItem);

  // Específicando qual pizza está no modal quando clicar, armazendando o índice de pizzas a  uma váriavel.
  pizzaItem.setAttribute("data-key", index);

  // Manuseando os elementos do html:
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  // Adicionando um evento a tag de link do html, para adicionar o modal:
  // O prevent, vai tirar a ação padrão e alterar para o que queremos.
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    // Sempre que abrir o modal estará em 1 a quantidade.
    modalQt = 1;

    // Pegando a informação para abrir no modal a pizza certa.
    let key = e.target.closest(".pizza-item").getAttribute("data-key");

    // Preenchendo a váriavel de modal para armazenar os dados para o carrinho.
    // Sempre que abrir o modal a váriavel vai armazenar o indice daquela pizza.
    modalKey = key;

    // Agora pegando a key(indice da lista de pizzas) e adicionando as informações de cada pizza no modal:
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;

    // Fazendo que quando feche o modal deixe de selecionar o tamanho que tinha selecionado antes:
    c(".pizzaInfo--size.selected").classList.remove("selected");

    // Pegando os elementos de tamanho e adicionando as informações:
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      // Verificação do tamanho das pizzas:
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    // Usando a quantidade de pizzas:
    c(".pizzaInfo--qt").innerHTML = modalQt;

    // Mesclando css com js, para que o modal abra de forma mais "delicada".
    // Então, primeiro deixamos a opacidade em 0(invísivel) para depois que ele abrir tenha um tempo pequeno(a função está fazendo)para que abra com opacidade 100% depois disso.
    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 100);
  });

  c(".pizza-area").append(pizzaItem);
});

// Eventos do modal:
function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
}
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});

// Adicionando clique e desmarcação aos tamanhos de pizza:
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    // Tira quem está selecionado:
    c(".pizzaInfo--size.selected").classList.remove("selected");
    // Adiciona quem selecionou:
    size.classList.add("selected");
  });
});

// Adicionando itens ao carrinho:
c(".pizzaInfo--addButton").addEventListener("click", () => {
  // Váriavel para saber o  tamanho selecionado da pizza:
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

  // Verificações importantes:
  // Primeiro criamos uma váriavel identificadora, que vai ser usado como verificador. E se ela já existir no carrinho, é somada a já existente.
  let identifier = pizzaJson[modalKey].id + "/" + size;
  let key = cart.findIndex((item) => item.identifier == identifier);

  // Verificação:
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    // Adicionando as informações na lista carrinho.
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size: size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

// Versão mobile:
c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

function updateCart() {
  // Versão mobile:
  c(".menu-openner span").innerHTML = cart.length;

  // Fazendo aparecer o carringo quando tiver pizzas nele:
  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";

    // Calculos:
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    // Pegando item a item para exibir:
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = c(".models .cart--item").cloneNode(true);

      // Indicando tamanho das pizzas no carrinho:
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      // Preenchendo:
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

      // Contador de pizzas no carrinho:
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      c(".cart").append(cartItem);
    }

    desconto = subtotal * 0.05;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
}
