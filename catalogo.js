// ==================================================
// CATÁLOGO CLTS DO COMBATE
// ==================================================


// --------------------------------------------------
// ELEMENTOS
// --------------------------------------------------

const productsGrid =
  document.getElementById("products-grid");

const productCount =
  document.getElementById("product-count");

const catalogTitle =
  document.getElementById("catalog-title");

const searchInput =
  document.getElementById("search");

const sortSelect =
  document.getElementById("sort");

const emptyState =
  document.getElementById("empty-state");


// --------------------------------------------------
// CATEGORIA DA URL
// --------------------------------------------------

const params =
  new URLSearchParams(window.location.search);

let categoriaAtual =
  params.get("modalidade") || "todos";


// --------------------------------------------------
// NOME DAS CATEGORIAS
// --------------------------------------------------

const nomesCategorias = {

  "todos": "Todos os produtos",

  "jiu-jitsu": "Produtos de Jiu-Jitsu",

  "judo": "Produtos de Judô",

  "muay-thai": "Produtos de Muay Thai",

  "boxe": "Produtos de Boxe",

  "karate": "Produtos de Karatê",

  "taekwondo": "Produtos de Taekwondo",

  "mma": "Produtos de MMA",

  "acessorios": "Acessórios"

};


// --------------------------------------------------
// NORMALIZAR TEXTO
// --------------------------------------------------

function normalizar(texto) {

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}


// --------------------------------------------------
// FORMATAR PREÇO
// --------------------------------------------------

function formatarPreco(preco) {

  return Number(preco).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


// --------------------------------------------------
// CHAVE ÚNICA DO PRODUTO
// --------------------------------------------------
//
// IMPORTANTE:
//
// JIU-JITSU ID 1
// JUDÔ ID 1
//
// podem existir ao mesmo tempo.
//
// O sistema diferencia:
// jiu-jitsu-1
// judo-1
//
// --------------------------------------------------

function chaveProduto(produto) {

  return `${produto.categoria}-${produto.id}`;

}


// --------------------------------------------------
// PRODUTOS DA CATEGORIA
// --------------------------------------------------

function pegarProdutos() {

  let resultado = [...produtos];


  // Filtrar modalidade

  if (categoriaAtual !== "todos") {

    resultado =
      resultado.filter(
        produto =>
          produto.categoria === categoriaAtual
      );

  }


  // Pesquisa

  const pesquisa =
    normalizar(searchInput.value.trim());


  if (pesquisa) {

    resultado =
      resultado.filter(produto => {

        const nome =
          normalizar(produto.nome);

        const descricao =
          normalizar(produto.descricao);

        return (
          nome.includes(pesquisa) ||
          descricao.includes(pesquisa)
        );

      });

  }


  // Ordenação

  const ordem =
    sortSelect.value;


  if (ordem === "price-low") {

    resultado.sort(
      (a, b) =>
        Number(a.preco) -
        Number(b.preco)
    );

  }


  if (ordem === "price-high") {

    resultado.sort(
      (a, b) =>
        Number(b.preco) -
        Number(a.preco)
    );

  }


  if (ordem === "name") {

    resultado.sort(
      (a, b) =>
        a.nome.localeCompare(
          b.nome,
          "pt-BR"
        )
    );

  }


  return resultado;

}


// --------------------------------------------------
// IMAGEM FALLBACK
// --------------------------------------------------

function imagemFallback(img) {

  img.onerror = null;

  img.src =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        viewBox="0 0 800 800"
      >

        <rect
          width="800"
          height="800"
          fill="#06131d"
        />

        <text
          x="400"
          y="365"
          text-anchor="middle"
          fill="#00e8ff"
          font-family="Arial"
          font-size="34"
          font-weight="bold"
        >
          CLTS
        </text>

        <text
          x="400"
          y="420"
          text-anchor="middle"
          fill="#60717d"
          font-family="Arial"
          font-size="20"
        >
          IMAGEM DO PRODUTO
        </text>

      </svg>
    `);

}


// --------------------------------------------------
// CRIAR CARD
// --------------------------------------------------

function criarCard(produto) {

  const card =
    document.createElement("article");

  card.className =
    "product-card";


  const chave =
    chaveProduto(produto);


  card.dataset.id =
    produto.id;

  card.dataset.categoria =
    produto.categoria;

  card.dataset.chave =
    chave;


  card.innerHTML = `

    <div class="product-image">

      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
        onerror="imagemFallback(this)"
      >

    </div>


    <div class="product-info">

      <div class="product-category">
        ${produto.categoria}
      </div>


      <h2 class="product-name">
        ${produto.nome}
      </h2>


      <p class="product-description">
        ${produto.descricao}
      </p>


      <div class="product-bottom">

        <strong class="product-price">
          ${formatarPreco(produto.preco)}
        </strong>


        <button
          class="buy-btn"
          type="button"
          data-product-key="${chave}"
        >
          COMPRAR
        </button>

      </div>

    </div>

  `;


  return card;

}


// --------------------------------------------------
// RENDERIZAR
// --------------------------------------------------

function renderizarProdutos() {

  const lista =
    pegarProdutos();


  productsGrid.innerHTML = "";


  productCount.textContent =
    lista.length === 1
      ? "1 produto encontrado"
      : `${lista.length} produtos encontrados`;


  catalogTitle.textContent =
    nomesCategorias[categoriaAtual] ||
    "Todos os produtos";


  // Nenhum produto

  if (lista.length === 0) {

    emptyState.classList.add("show");

    return;

  }


  emptyState.classList.remove("show");


  // Criar cards

  lista.forEach(produto => {

    const card =
      criarCard(produto);

    productsGrid.appendChild(card);

  });

}


// --------------------------------------------------
// BOTÕES DE CATEGORIA
// --------------------------------------------------

function atualizarCategoriaAtiva() {

  document
    .querySelectorAll(".category-btn")
    .forEach(botao => {

      const categoria =
        botao.dataset.category;


      botao.classList.toggle(
        "active",
        categoria === categoriaAtual
      );

    });

}


// --------------------------------------------------
// PESQUISA
// --------------------------------------------------

searchInput.addEventListener(
  "input",
  renderizarProdutos
);


// --------------------------------------------------
// ORDENAÇÃO
// --------------------------------------------------

sortSelect.addEventListener(
  "change",
  renderizarProdutos
);


// --------------------------------------------------
// COMPRAR
// --------------------------------------------------

productsGrid.addEventListener(
  "click",
  event => {

    const botao =
      event.target.closest(".buy-btn");


    if (!botao) {
      return;
    }


    const chave =
      botao.dataset.productKey;


    const produto =
      produtos.find(
        item =>
          chaveProduto(item) === chave
      );


    if (!produto) {
      return;
    }


    adicionarCarrinho(produto);

  }
);


// --------------------------------------------------
// CARRINHO
// --------------------------------------------------

function adicionarCarrinho(produto) {

  let carrinho = [];


  try {

    carrinho =
      JSON.parse(
        localStorage.getItem("clts-carrinho")
      ) || [];

  } catch {

    carrinho = [];

  }


  const chave =
    chaveProduto(produto);


  const existente =
    carrinho.find(
      item =>
        item.chave === chave
    );


  if (existente) {

    existente.quantidade++;

  } else {

    carrinho.push({

      chave: chave,

      id: produto.id,

      categoria: produto.categoria,

      nome: produto.nome,

      preco: produto.preco,

      imagem: produto.imagem,

      quantidade: 1

    });

  }


  localStorage.setItem(
    "clts-carrinho",
    JSON.stringify(carrinho)
  );


  mostrarMensagem(
    `${produto.nome} foi adicionado ao carrinho.`
  );

}


// --------------------------------------------------
// MENSAGEM
// --------------------------------------------------

function mostrarMensagem(texto) {

  let mensagem =
    document.getElementById("catalog-toast");


  if (!mensagem) {

    mensagem =
      document.createElement("div");

    mensagem.id =
      "catalog-toast";


    mensagem.style.position =
      "fixed";

    mensagem.style.left =
      "50%";

    mensagem.style.bottom =
      "25px";

    mensagem.style.transform =
      "translateX(-50%)";

    mensagem.style.background =
      "#071923";

    mensagem.style.border =
      "1px solid #00e8ff";

    mensagem.style.color =
      "#ffffff";

    mensagem.style.padding =
      "13px 20px";

    mensagem.style.zIndex =
      "9999";

    mensagem.style.fontSize =
      "13px";

    mensagem.style.fontWeight =
      "700";

    document.body.appendChild(
      mensagem
    );

  }


  mensagem.textContent =
    texto;


  mensagem.style.opacity =
    "1";


  clearTimeout(
    window.catalogToastTimeout
  );


  window.catalogToastTimeout =
    setTimeout(() => {

      mensagem.style.opacity =
        "0";

    }, 2200);

}


// --------------------------------------------------
// INICIAR
// --------------------------------------------------

atualizarCategoriaAtiva();

renderizarProdutos();