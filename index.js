#!/usr/bin/env node

const shell = require('shelljs')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const path = require('path')

const PWD = shell.pwd().toString()
const addressText = path.join(PWD, 'address.txt')
const contractFolder = path.join(PWD, 'contracts/')
const param = process.argv[2]
switch (param) {
  case 'address': {
    /* Download Addresses */
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const mainURL = `https://etherscan.io/contractsVerified/${i + 1}`
        request.get(mainURL, (req, res, body) => {
          console.log(`>> Surfing ${mainURL}`)
          const address = []
          const $ = cheerio.load(body)
          const tds = $('tbody td')
          for (let i = 0; i < tds.length; i += 7) {
            address.push(tds.eq(i).text().trim())
          }
          fs.appendFileSync(addressText, address.join('\n') + '\n', 'utf8')
        })
      }, i * 100)
    }
    break
  }
  case 'contract': {
    if (!fs.existsSync(addressText)) {
      console.log('No address.txt file')
      process.exit()
    }
    if (!fs.existsSync(contractFolder)) {
      fs.mkdirSync(contractFolder)
    }
    const address = fs.readFileSync(addressText, 'utf8')
      .split('\n')
      .filter(l => l.length && !l.startsWith('#') && !l.startsWith('//'))
    for (let i = 0; i < address.length; i++) {
      setTimeout(() => {
        const url = `https://etherscan.io/address/${address[i]}`
        request.get(url, (req, res, body) => {
          console.log(`>> Surfing ${url}`)
          const $ = cheerio.load(body)
          const code = $('.js-sourcecopyarea').text().trim()
          const name = $('#ContentPlaceHolder1_contractCodeDiv td').eq(1).text().trim()
          if (code.length && name.length) {
            fs.writeFileSync(path.join(contractFolder, `${i}_${name}.sol`), code, 'utf8')
          }
        })
      }, i * 500)
    }
    break
  }
}
