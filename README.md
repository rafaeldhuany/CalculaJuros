# Calcula Juros - Calculadora de Juros Compostos 📈 

**Calcula Juros** é uma calculadora financeira interativa projetada para simular o crescimento do seu patrimônio de forma clara e visual. Nascida da necessidade de facilitar o planejamento financeiro, a ferramenta permite que você entenda o poder dos juros compostos no longo prazo através de aportes mensais constantes, tudo em uma interface moderna e responsiva.

Ou teste a Yeldra diretamente no navegador:
👉 https://ovacilo.github.io/CalculaJuros/

---

## 🚀 O Problema que Resolvemos

Planejar o futuro financeiro e projetar o impacto do tempo nos investimentos muitas vezes exige o uso de planilhas complexas ou ferramentas engessadas. A Yeldra foi criada com um intuito claro: fornecer uma visualização rápida, dinâmica e compreensível de como o seu dinheiro escala ao longo dos anos. Sem necessidade de cadastros ou servidores: apenas os seus números ganhando vida em gráficos e tabelas instantâneas.

## ✨ Funcionalidades Principais

* **Cálculos em Tempo Real:** Modifique o valor inicial, aportes mensais, taxa de juros (mensal ou anual) e período, e veja os resultados serem atualizados instantaneamente.
* **Gráfico Interativo:** Visualização em linha (alimentada por Chart.js) que compara o valor total acumulado versus o valor total que saiu do seu bolso (investido).
* **Extrato Mensal Detalhado:** Uma tabela completa que mostra o rendimento exato, total aportado e o saldo acumulado mês a mês.
* **Modo Dark/Light:** Interface adaptável com alternância de tema suave, salvando a sua preferência automaticamente no navegador (via cookies).
* **Funcionamento 100% Offline (Client-Side):** Todo o processamento matemático e renderização visual ocorrem localmente via JavaScript no seu navegador, garantindo agilidade e privacidade.

---

## 🛠️ Tecnologias Utilizadas

O sistema foi construído focando em performance, modularidade e design profissional sem depender de frameworks pesados de front-end:

* HTML5 (Semântico)
* CSS3 (Variáveis nativas e design responsivo customizado)
* JavaScript (Vanilla)
* [Chart.js](https://www.chartjs.org/) (Para a renderização do gráfico patrimonial)
* [Lucide Icons](https://lucide.dev/) (Para a iconografia minimalista)

---

## ⚙️ Como Executar o Projeto Localmente

A Yeldra foi construída para ser incrivelmente simples e portátil. Você pode executá-la de duas maneiras, dependendo do seu nível de conforto e ferramentas disponíveis:

### Opção 1: Execução Direta no Navegador (Mais Rápido e Offline)
Como o sistema é 100% Client-Side, você não precisa de nenhum software adicional para rodá-lo.
1. Baixe este repositório em formato `.zip` clicando em "Code" > "Download ZIP" no GitHub.
2. Extraia a pasta `Yeldra` (ou o nome que deu ao repositório) no seu computador.
3. Dê um clique duplo no arquivo `index.html` (ou arraste-o para o seu navegador favorito, como Chrome, Firefox ou Edge).
4. O sistema abrirá diretamente no navegador e já estará funcionando.

### Opção 2: Usando um Servidor Local (XAMPP / WampServer)
Se você prefere simular um ambiente de servidor local no seu desktop usando aplicativos de hospedagem local:
1. Baixe e instale o **XAMPP** ou **WampServer** no seu computador.
2. Baixe o projeto em `.zip` e extraia a pasta.
3. Mova a pasta extraída para o diretório público do seu servidor:
   * **No XAMPP:** Cole a pasta dentro de `C:\xampp\htdocs\`
   * **No WampServer:** Cole a pasta dentro de `C:\wamp64\www\`
4. Inicie o painel de controle do seu servidor (XAMPP/WampServer) e ative o serviço **Apache**.
5. Abra o seu navegador e acesse a URL: `http://localhost/nome-da-pasta`