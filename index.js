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

  "Par Mat'#9885 - discord.gg/osint" +
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
    console.log(`\n[${chalk.greenBright("+")}] Pseudo: ` + playerData.data.player.name)
    console.log(`[${chalk.greenBright("+")}] Rang: ` + playerData.data.player.rank.name)
    let hasBoost = playerData.data.player.hasBoost;
    if (hasBoost === true) hasBoost = "Oui"; else hasBoost = "Non";
    console.log(`[${chalk.greenBright("+")}] Booster: ` + hasBoost)
    let connectionMethod = playerData.data.player.connectionMethod;
    if (connectionMethod === 'CRACK') connectionMethod = "Crack"; else if (connectionMethod === 'PREMIUM') connectionMethod = "Premium"; else connectionMethod = "Inconnu";
    console.log(`[${chalk.greenBright("+")}] Type de compte: ` + connectionMethod)
    if(connectionMethod === "Premium") {
      console.log(`   [${chalk.blueBright("*")}] UUID: ` + (await axios({ url: `https://minecraft-api.com/api/uuid/${playerData.data.player.name}`, method: 'GET', })).data)
      console.log(`   [${chalk.blueBright("*")}] Skin: ` + `https://minecraft-api.com/api/skins/${playerData.data.player.name}/body/10.5/10/`)
      console.log(`   [${chalk.blueBright("*")}] Tête: ` + `https://minecraft-api.com/api/skins/${playerData.data.player.name}/head/10.5/10/`)
    }
    let discordAsLink = playerData.data.player.links.discord;
    if (discordAsLink === null) discordAsLink = "Aucun compte lié"; else discordAsLink = `${discordAsLink}`
    console.log(`\n[${chalk.greenBright("+")}] Compte Discord: ` + discordAsLink)

    if(playerData.data.player.links.discord !== null) {
      if(config['discord-bot-token'] === "") {
        console.log(`   [${chalk.redBright("-")}] Vous devez ajouter un token de bot discord dans le fichier config.json pour pouvoir avoir les informations du compte discord`)
      } else {
        const discordData = await axios({
          url: `https://discord.com/api/v9/users/${discordAsLink}`,
          method: 'GET',
          headers: {
            Authorization: `Bot ${config['discord-bot-token']}`
          }
        })
        console.log(`   [${chalk.blueBright("*")}] Pseudo: ` + discordData.data.username)
        console.log(`   [${chalk.blueBright("*")}] Discriminateur: ` + discordData.data.discriminator)
        console.log(`   [${chalk.blueBright("*")}] Avatar: ` + `https://cdn.discordapp.com/avatars/${discordData.data.id}/${discordData.data.avatar}`)
        console.log(`   [${chalk.blueBright("*")}] Bannière: ` + `https://cdn.discordapp.com/banners/${discordData.data.id}/${discordData.data.banner}`)
        console.log(`   [${chalk.blueBright("*")}] Couleur de bannière: ` + discordData.data.banner_color)
        console.log(`   [${chalk.blueBright("*")}] Couleur d'accentuation: ` + discordData.data.accent_color)
        console.log(`   [${chalk.blueBright("*")}] Flags public: ` + discordData.data.public_flags)
      }
    }
  }

  main()
})
