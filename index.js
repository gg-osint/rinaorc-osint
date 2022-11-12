const axios = require('axios')
const config = require('./config.json')
const readline = require('readline')
const cmd = readline.createInterface(process.stdin, process.stdout)
const chalk = require('chalk')

console.log(chalk.yellowBright(" 888888ba  oo                                                   dP                     dP          \n" +
  " 88    `8b                                                      88                     88          \n" +
  "a88aaaa8P' dP 88d888b. .d8888b. .d8888b. 88d888b. .d8888b.    d8888P .d8888b. .d8888b. 88 .d8888b. \n" +
  " 88   `8b. 88 88'  `88 88'  `88 88'  `88 88'  `88 88'  `\"\"      88   88'  `88 88'  `88 88 Y8ooooo. \n" +
  " 88     88 88 88    88 88.  .88 88.  .88 88       88.  ...      88   88.  .88 88.  .88 88       88 \n" +
  " dP     dP dP dP    dP `88888P8 `88888P' dP       `88888P'      dP   `88888P' `88888P' dP `88888P' \n"))

console.log("Par Mat'#9885 - discord.gg/osint\n\n")



cmd.question('Pseudo de la cible : ', (pseudo) => {
  async function main () {
    try {
      await axios({
        url: `https://api.rinaorc.com/player/shika258`,
        method: 'GET',
        headers: { 'API-Key': config['api-token'] }
      })
    } catch (error) {
      return console.log(`\n[${chalk.redBright('-')}] Erreur: ` + `La clef d'API fournit n'est pas valide`)
    }
    try {

      let startTime = new Date().getTime()
      let elapsedTime = 0

      const playerData = await axios({
        url: `https://api.rinaorc.com/player/${pseudo}`,
        method: 'GET',
        headers: {
          'API-Key': config['api-token']
        }
      })

      console.log(`\n[${chalk.greenBright('+')}] Pseudo: ` + playerData.data.player.name)
      console.log(`[${chalk.greenBright('+')}] Rang: ` + playerData.data.player.rank.name)

      let hasBoost = playerData.data.player.hasBoost
      if (hasBoost === true) hasBoost = 'Oui'; else hasBoost = 'Non'
      console.log(`[${chalk.greenBright('+')}] Booster: ` + hasBoost)
      console.log(`   [${chalk.blueBright('*')}] Temps de boost total: ` + playerData.data.player.boostMonths + ' mois \n')

      let connectionMethod = playerData.data.player.connectionMethod
      if (connectionMethod === 'CRACK') connectionMethod = 'Crack'; else if (connectionMethod === 'PREMIUM') connectionMethod = 'Premium'; else connectionMethod = 'Inconnu'
      console.log(`[${chalk.greenBright('+')}] Type de compte: ` + connectionMethod)

      if (connectionMethod === 'Premium') {
        try {
          console.log(`   [${chalk.blueBright('*')}] UUID: ` + (await axios({
            url: `https://minecraft-api.com/api/uuid/${playerData.data.player.name}`,
            method: 'GET'
          })).data)
          console.log(`   [${chalk.blueBright('*')}] Skin: ` + `https://minecraft-api.com/api/skins/${playerData.data.player.name}/body/10.5/10/`)
          console.log(`   [${chalk.blueBright('*')}] Tête: ` + `https://minecraft-api.com/api/skins/${playerData.data.player.name}/head/10.5/10/`)
        } catch (err) {
          console.log(`   [${chalk.redBright('-')}] Erreur lors de la récupération des informations du compte Minecraft`)
        }
      }

      let discordAsLink = playerData.data.player.links.discord
      if (discordAsLink === null) discordAsLink = 'Aucun compte lié'; else discordAsLink = `${discordAsLink}`
      console.log(`\n[${chalk.greenBright('+')}] Compte Discord: ` + discordAsLink)

      if (playerData.data.player.links.discord !== null) {
        try {
          const discordData = await axios({
            url: `https://discord.com/api/v10/users/${discordAsLink}`,
            method: 'GET',
            headers: {
              Authorization: `Bot ${config['discord-bot-token']}`
            }
          })
          console.log(`   [${chalk.blueBright('*')}] Pseudo: ` + discordData.data.username)
          console.log(`   [${chalk.blueBright('*')}] Discriminateur: ` + discordData.data.discriminator)
          console.log(`   [${chalk.blueBright('*')}] Avatar: ` + `https://cdn.discordapp.com/avatars/${discordData.data.id}/${discordData.data.avatar}`)
          console.log(`   [${chalk.blueBright('*')}] Bannière: ` + `https://cdn.discordapp.com/banners/${discordData.data.id}/${discordData.data.banner}`)
          console.log(`   [${chalk.blueBright('*')}] Couleur de bannière: ` + discordData.data.banner_color)
          console.log(`   [${chalk.blueBright('*')}] Couleur d'accentuation: ` + discordData.data.accent_color)
          console.log(`   [${chalk.blueBright('*')}] Flags public: ` + discordData.data.public_flags)
        } catch {
          console.log(`   [${chalk.redBright('-')}] Impossible de récupérer les informations du compte discord, cela peut être dû à un token invalide ou à un compte banni`)
        }
      }

      elapsedTime = new Date().getTime() - startTime
      console.log(`\n\nCe script a été exécuté en ${elapsedTime / 1000} seconde.`)
      cmd.close()

    } catch (error) {
      console.log(`\n[${chalk.redBright('-')}] Erreur: ` + 'Le pseudo n\'existe pas ou le compte n\'est pas lié à Rinaorc.')
    }
  }

  main()
})
