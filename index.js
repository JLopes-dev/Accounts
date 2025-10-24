// Módulos Externos
import chalk from "chalk";
import inquirer from "inquirer";

// Módulos Internos
import fs from "fs";

const defaultColor = chalk.bold.bgBlack.white;
console.log("Projeto Accounts");

prompt();

function prompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",

        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((resposta) => {
      switch (resposta.action) {
        case "Criar Conta":
          criarConta();
          break;

        case "Consultar Saldo":
          consultarSaldo();
          break;

        case "Depositar":
          deposito();
          break;

        case "Sacar":
          sacar();
          break;

        case "Sair":
          console.log(defaultColor("Obrigado por usar o Accounts!"));
          process.exit();

        default:
          break;
      }
    })
    .catch((err) => console.log("Error", err));
}

function criarConta() {
  console.log(defaultColor("Parabéns por escolher o nosso banco!"));
  console.log(defaultColor("Defina as opções da sua conta a seguir"));
  construirConta();
}

function construirConta() {
  inquirer
    .prompt([
      {
        name: "AccountName",
        message: "Digite um nome para sua conta:",
      },
    ])
    .then((resposta) => {
      const accountName = resposta.AccountName.toString().toUpperCase();

      if (!fs.existsSync("./accounts")) {
        fs.mkdirSync("./accounts");
      }

      if (fs.existsSync(`./accounts/${accountName}.json`)) {
        console.log(defaultColor("A conta já existe, escolha outro nome!"));
        construirConta();
        return;
      }

      fs.writeFileSync(
        `./accounts/${accountName}.json`,
        JSON.stringify({ balance: 0 })
      );

      console.log(defaultColor("Conta criada com sucesso!"));
      prompt();
    })
    .catch((err) => console.log(err));
}

function deposito() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((resposta) => {
      const accountName = resposta.accountName.toString().toUpperCase();

      if (!checarExistenciaDeArquivo(accountName)) {
        console.log("Essa conta não existe. Tente novamente.");
        return deposito();
      }

      inquirer
        .prompt([
          {
            name: "valor",
            message: "Quanto deseja depositar?",
          },
        ])
        .then((respostaDois) => {
          if (!respostaDois.valor || isNaN(respostaDois.valor) || respostaDois.valor <= 0) {
            console.log("É necessário inserir um valor válido.");
            return deposito();
          }
          depositar(accountName, respostaDois.valor);
          console.log("Depósito realizado com sucesso!");
          prompt();
        });
    })
    .catch((err) => console.log(err));
}

function checarExistenciaDeArquivo(nome) {
  return fs.existsSync(`./accounts/${nome}.json`);
}

function depositar(accountName, valor) {
  let conteudo = getFile(accountName);
  conteudo.balance =
    parseFloat(conteudo.balance) + parseFloat(valor);
  fs.writeFileSync(
    `./accounts/${accountName}.json`,
    JSON.stringify(conteudo)
  );
}

function getFile(accountName) {
  const file = fs.readFileSync(
    `./accounts/${accountName}.json`,
    { encoding: "utf-8", flag: "r" }
  );
  return JSON.parse(file);
}


function consultarSaldo() {
  console.log("Função Consultar Saldo ainda não implementada.");
  prompt();
}

function sacar() {
  console.log("Função Sacar ainda não implementada.");
  prompt();
}