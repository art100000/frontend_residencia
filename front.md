Interface simples em HTML + CSS + JavaScript para consumir uma API de detecção de malware. O sistema permite enviar arquivos individuais ou CSVs e exibe o resultado em um modal dinâmico, com cores e instruções específicas para cada caso.


Upload de arquivo (binário ou CSV)

Aceite obrigatório de termos antes de enviar

Envio do arquivo via FormData() para a API

Modal com:

Vermelho para malware

Verde para arquivo seguro

Tabela de resultados para CSV

Mensagens de erro amigáveis

Loading simples durante a análise

📂 Estrutura do Projeto
/
│── index.html     → Estrutura da página
│── style.css      → Estilização (modal, layout, cores)
│── script.js      → Lógica do upload, fetch e exibição dos resultados

Como funciona

O usuário escolhe o arquivo.

Marca a caixa de termos.

Clica em Enviar.

O JavaScript cria um FormData() e envia para a API via fetch.

A API retorna:

prediction: 1 ou 0 (arquivo único)

predictions: [1,0,1,...] (CSV)

O front verifica:

1 = malware

0 = seguro

Um modal é exibido com o resultado correspondente.