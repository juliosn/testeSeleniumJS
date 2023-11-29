const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Caminho do chromedriver.exe no seu sistema
const chromeDriverPath = './teste_automatizado/chromedriver.exe';

// URL do repositório Github
const githubRepoUrl = 'https://github.com/juliosn/PortfolioAms2023-3DS';

// Nome do arquivo para salvar os resultados
const resultadoFilePath = 'resultado.txt';

// Iniciar o navegador
async function startBrowser() {
  let options = new chrome.Options();
  options.addArguments('--disable-gpu', '--window-size=1920,1080');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

// Teste automatizado
async function runTest() {
  let driver = await startBrowser();

  try {
    // Abrir o Github e navegar para o repositório
    await driver.get(githubRepoUrl);

    // Aguardar até que o elemento da página seja carregado
    await driver.wait(until.elementLocated(By.css('.repohead h1 strong a')));

    // Obter o nome do repositório
    const repoName = await driver.findElement(By.css('.repohead h1 strong a')).getText();
    console.log('Nome do Repositório:', repoName);

    // Disponibilizar a busca pelo Google
    const searchQuery = `site:github.com ${repoName}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    console.log('URL de Busca no Google:', googleSearchUrl);

    // Navegar para a página de busca no Google
    await driver.get(googleSearchUrl);

    // Aguardar até que os resultados da pesquisa sejam exibidos
    await driver.wait(until.elementLocated(By.css('#search')));

    // Validar se o link do repositório está presente nos resultados
    const repoLink = await driver.findElement(By.partialLinkText('github.com'));

    let resultado = '';

    if (await repoLink.isDisplayed()) {
      resultado = 'O repositório está na página de resultados do Google.';
    } else {
      resultado = 'O repositório NÃO está na página de resultados do Google.';
    }

    // Salvar o resultado no arquivo
    fs.writeFileSync(resultadoFilePath, resultado);
    console.log(`Resultado salvo em ${resultadoFilePath}`);

  } finally {
    // Fechar o navegador no final do teste
    await driver.quit();
  }
}

// Executar o teste
runTest();