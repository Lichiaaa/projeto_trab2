Instruções para instalação
 - Tenha o node.js instalado (https://nodejs.org/en/download)
 - com o arquivo do código baixado, para preparar o ambiente, certifique-se de que executou esses comandos em seu terminal:
  npm init -y
  npm install typescript ts-node --save-dev
  npx tsc --init
  npm install @types/node --save-dev
  npm install better-sqlite3
  npm install -D @types/better-sqlite3

Sobre o projeto
O projeto é um trabalho para demonstrar como é a implementação em camadas. Explicação de cada camada, pensando que cada uma é uma das pastas:
"main" - Camada para declaração de estruturas das classes, apenas com metodos para comportamentos, não é nela que vamos fazer os métodos de adicionar consulta por exemplo, mas nela podemos ter o método de verificação se duas consultas tem horários conflitantes;
"repository" - Camada de comunicação entre o banco de dados e o service;
"service" - Camada com os metodos que adicionam as consultas, removem e listam todos os agendamentos;
"cli" e "public" - Camada de interface e codigo html, respectivamente;

Explicações sobre partes do código
