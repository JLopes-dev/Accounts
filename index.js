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

      inquirer.prompt([{
        name: "accountPassword",
        message: "Digite a senha para sua conta:"
      }]).then(respostaDois => {

     
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
        JSON.stringify({ balance: 0, password: respostaDois.accountPassword})
      );

      console.log(defaultColor("Conta criada com sucesso!"));
      prompt();
    })
     }).catch(err => console.log(err))
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


function consultarSaldo(accountName) {
  return prompt();
}

function sacar() {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Digite o nome da sua conta:"
    }
  ]).then(resposta => {
    const accountName = resposta.accountName.toString().toUpperCase();

    if (!checarExistenciaDeArquivo(accountName)) {
      console.log("Essa conta não existe. Tente novamente.");
      return prompt();
    }

    inquirer.prompt([
      {
        name: "accountPassword",
        message: "Digite sua senha:"
      }
    ]).then(respostaDois => {
      const file = getFile(accountName);

      if (file.password !== respostaDois.accountPassword) {
        console.log(defaultColor("Nome ou senha inválidos!"));
        return prompt();
      }

      inquirer.prompt([
        {
          name: "valor",
          message: "Quanto deseja sacar?"
        }
      ]).then(respostaTres => {
        if (!respostaTres.valor || isNaN(respostaTres.valor) || parseFloat(respostaTres.valor) <= 0) {
          console.log(defaultColor("É necessário inserir um valor válido."));
          return prompt();
        }

        if (parseFloat(respostaTres.valor) > file.balance) {
          console.log(defaultColor("Saldo insuficiente."));
          return prompt();
        }

        file.balance -= parseFloat(respostaTres.valor);
        fs.writeFileSync(`./accounts/${accountName}.json`, JSON.stringify(file));
        console.log(defaultColor("Saque efetuado com sucesso!"));
        prompt();
      });

    });

  }).catch(err => console.log(err));
}

function consultarSaldoValidacoes() {
  
  prompt();
}


/*











            

*/