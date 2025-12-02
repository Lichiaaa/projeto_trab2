Discentes: Alicia Yumi Fujimoto Araujo Dota - RGA: 202426610015;

João Harry Oliveira Hudson - RGA: 202426610037

Disciplina: Arquitetura de Software

3° Semestre - Engenharia de Software


Instruções para instalação
-
   - Tenha o node.js instalado (https://nodejs.org/en/download)
   - com o arquivo do código, para preparar o ambiente, certifique-se de que executou esses comandos em seu terminal:
  
    npm init -y
    npm install typescript ts-node --save-dev
    npx tsc --init
    npm install @types/node --save-dev
    npm install better-sqlite3
    npm install -D @types/better-sqlite3
  
Sobre o projeto
-
O projeto é um trabalho para demonstrar como é a implementação em camadas. Explicação de cada camada, pensando que cada uma é uma das pastas:

*"main"* - Camada para declaração de estruturas das classes, apenas com metodos para comportamentos, não é nela que vamos fazer os métodos de adicionar consulta por exemplo, mas nela podemos ter o método de verificação se duas consultas tem horários conflitantes;

*"repository"* - Camada de comunicação entre o banco de dados e o service;

*"service"* - Camada com os metodos que adicionam as consultas, removem e listam todos os agendamentos;

*"cli"* e *"public"* - Camada de interface e codigo html, respectivamente;

Nossa ideia foi pensada como se o programa fosse para um clínica médica, que nomeamos de "Clínica Synapse", apenas para poder montar uma ideia mais criativa para o html, para que a página web ficasse mais personalizada.

Explicações sobre partes do código
-
Na lógica, começamos criando a classe principal (*class Consulta*), se reparar, pode perceber que não é nela que criamos os métodos de ação, ou seja, métodos que usam objetos *Consulta* para fazer algo, por exemplo adicionar ou remover da lista, porque isso vai contecer na camada de *"service"*, mas antes nos decidimos organizar a parte do repositório, para já importar os métodos e interfaces criadas no *"repository"* para o *"service"*, importante notar que é na parte de repositório que importamos o *better-Sqlite3*. Então, fizemos na camada de *"service"*, uma *class Service*, que puxa o repositório para listar as consultas, vai também conseguir adicionar e remover, mas não é ele diretamente que faz isso, é na parte de repositório que tem essa intermediação. Por fim, criamos uma interface, para o usuário usar em html (página web), porém apenas a página web não é suficiente, é necessário criarmos um servidor, que fica na camada *"main"*, página web por sua vez fica na camada *"public"*.

Alterações manuais feitas no arquivo *tsconfig.json*:

        "module": "CommonJS", //mudança de "nodenext" para "CommonJS"
        "moduleResolution": "node", //adicionado manualmente
        "target": "ES2020", //mudança de "esnext" para "ES2020"
        "types": ["node", "better-sqlite3"], //adicionado manualmente para que o TS não ignore os types
        "esModuleInterop": true,              //adicionado manualmente
        "allowSyntheticDefaultImports": true,       //adicionado manualmente
        "verbatimModuleSyntax": false, //mudança de "true" para "false"

*As alterações foram feitas nos commits para o repositório, porém se quiser verificar para correto funcionamento do código.

Adicionado uma forma mais simple para ligar o servidor:
Em *package.json*, adicionamos na parte de *"scripts"* *"server": "ts-node main/server.ts"*, para não ter que escrever o comando todo.

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "server": "ts-node main/server.ts"
    },

Assim para executar o servidor escreva no terminal:

    npm run server

*Importante ligar o server antes de abrir o html, porque se o html não tiver conexão com o servidor, não será possivel puxar dados do repositório, nem adicionar ou mesmo remover consultas

Para executar a página web, pode-se simplesmente clicar no arquivo index.html, na camada "public", e ele vai abrir no seu navegador.
