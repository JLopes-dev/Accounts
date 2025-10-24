// External Modules
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";

const defaultColor = chalk.bold.bgBlack.white;
console.log("Projeto Accounts");

mainMenu();

function mainMenu() {
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
    .then((answer) => {
      switch (answer.action) {
        case "Criar Conta":
          createAccount();
          break;

        case "Consultar Saldo":
          checkBalance();
          break;

        case "Depositar":
          deposit();
          break;

        case "Sacar":
          withdraw();
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

function createAccount() {
  console.log(defaultColor("Parabéns por escolher o nosso banco!"));
  console.log(defaultColor("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName.toString().toUpperCase();

      inquirer
        .prompt([
          {
            name: "accountPassword",
            message: "Digite a senha para sua conta:",
          },
        ])
        .then((answerTwo) => {
          if (!fs.existsSync("./accounts")) {
            fs.mkdirSync("./accounts");
          }

          if (fs.existsSync(`./accounts/${accountName}.json`)) {
            console.log(defaultColor("A conta já existe, escolha outro nome!"));
            return buildAccount();
          }

          fs.writeFileSync(
            `./accounts/${accountName}.json`,
            JSON.stringify({ balance: 0, password: answerTwo.accountPassword })
          );

          console.log(defaultColor("Conta criada com sucesso!"));
          mainMenu();
        });
    })
    .catch((err) => console.log(err));
}

function checkFileExistence(accountName) {
  return fs.existsSync(`./accounts/${accountName}.json`);
}

function getAccountData(accountName) {
  const file = fs.readFileSync(`./accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(file);
}

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName.toString().toUpperCase();

      if (!checkFileExistence(accountName)) {
        console.log("Essa conta não existe. Tente novamente.");
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto deseja depositar?",
          },
        ])
        .then((answerTwo) => {
          if (
            !answerTwo.amount ||
            isNaN(answerTwo.amount) ||
            answerTwo.amount <= 0
          ) {
            console.log("É necessário inserir um valor válido.");
            return deposit();
          }

          let accountData = getAccountData(accountName);
          accountData.balance =
            parseFloat(accountData.balance) + parseFloat(answerTwo.amount);

          fs.writeFileSync(
            `./accounts/${accountName}.json`,
            JSON.stringify(accountData)
          );
          console.log("Depósito realizado com sucesso!");
          mainMenu();
        });
    })
    .catch((err) => console.log(err));
}

function withdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName.toString().toUpperCase();

      if (!checkFileExistence(accountName)) {
        console.log("Essa conta não existe. Tente novamente.");
        return mainMenu();
      }

      inquirer
        .prompt([
          {
            name: "accountPassword",
            message: "Digite sua senha:",
          },
        ])
        .then((answerTwo) => {
          const accountData = getAccountData(accountName);

          if (accountData.password !== answerTwo.accountPassword) {
            console.log(defaultColor("Nome ou senha inválidos!"));
            return mainMenu();
          }

          inquirer
            .prompt([
              {
                name: "amount",
                message: "Quanto deseja sacar?",
              },
            ])
            .then((answerThree) => {
              if (
                !answerThree.amount ||
                isNaN(answerThree.amount) ||
                parseFloat(answerThree.amount) <= 0
              ) {
                console.log(defaultColor("É necessário inserir um valor válido."));
                return mainMenu();
              }

              if (parseFloat(answerThree.amount) > accountData.balance) {
                console.log(defaultColor("Saldo insuficiente."));
                return mainMenu();
              }

              accountData.balance -= parseFloat(answerThree.amount);
              fs.writeFileSync(
                `./accounts/${accountName}.json`,
                JSON.stringify(accountData)
              );
              console.log(defaultColor("Saque efetuado com sucesso!"));
              mainMenu();
            });
        });
    })
    .catch((err) => console.log(err));
}

function checkBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer.accountName.toString().toUpperCase();

      if (!checkFileExistence(accountName)) {
        console.log("Essa conta não existe. Tente novamente.");
        return mainMenu();
      }

      inquirer
        .prompt([
          {
            name: "accountPassword",
            message: "Digite sua senha:",
          },
        ])
        .then((answerTwo) => {
          const accountData = getAccountData(accountName);

          if (accountData.password !== answerTwo.accountPassword) {
            console.log(defaultColor("Nome ou senha inválidos!"));
            return mainMenu();
          }

          console.log(
            defaultColor(`Seu saldo atual é: R$ ${accountData.balance}`)
          );
          mainMenu();
        });
    })
    .catch((err) => console.log(err));
}
