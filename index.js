const axios = require('axios')
const config = require('./config.json')
const readline = require('readline')
const cmd = readline.createInterface(process.stdin, process.stdout)
const chalk = require('chalk')

console.log("d8888b. d888888b d8b   db  .d8b.   .d88b.  d8888b.  .o88b.          .d88b.  .d8888. d888888b d8b   db d888888b \n" +
  "88  `8D   `88'   888o  88 d8' `8b .8P  Y8. 88  `8D d8P  Y8         .8P  Y8. 88'  YP   `88'   888o  88 `~~88~~' \n" +
  "88oobY'    88    88V8o 88 88ooo88 88    88 88oobY' 8P              88    88 `8bo.      88    88V8o 88    88    \n" +
  "88`8b      88    88 V8o88 88~~~88 88    88 88`8b   8b              88    88   `Y8b.    88    88 V8o88    88    \n" +
  "88 `88.   .88.   88  V888 88   88 `8b  d8' 88 `88. Y8b  d8         `8b  d8' db   8D   .88.   88  V888    88    \n" +
  "88   YD Y888888P VP   V8P YP   YP  `Y88P'  88   YD  `Y88P'          `Y88P'  `8888Y' Y888888P VP   V8P    YP    \n" +
  "\n" +
  "By Mat'#9885 " +
  "\n\n")

cmd.question('Entrez le pseudo : ', (pseudo) => {
  async function main () {
    const playerData = await axios({
      url: `https://api.rinaorc.com/player/${pseudo}`,
      method: 'GET',
      headers: {
        'API-Key': config['api-token']
      }
    })
    console.log(`\n [${chalk.greenBright("+")}] Pseudo: ` + playerData.data.player.name)
    console.log(`\n [${chalk.greenBright("+")}] Rang: ` + playerData.data.player.rank.name)
    let hasBoost = playerData.data.player.hasBoost;
    if (hasBoost === true) hasBoost = "Oui"; else hasBoost = "Non";
    console.log(`\n [${chalk.greenBright("+")}] Booster: ` + hasBoost)
    let connectionMethod = playerData.data.player.connectionMethod;
    if (connectionMethod === 'CRACK') connectionMethod = "Crack"; else if (connectionMethod === 'PREMIUM') connectionMethod = "Premium"; else connectionMethod = "Inconnu";
    console.log(`\n [${chalk.greenBright("+")}] Type de compte: ` + connectionMethod)
    let discordAsLink = playerData.data.player.links.discord;
    if (discordAsLink === null) discordAsLink = "Aucun compte lié"; else discordAsLink = `${discordAsLink}`
    console.log(`\n [${chalk.greenBright("+")}] ID Discord: ` + discordAsLink)
  }

  main()
})



