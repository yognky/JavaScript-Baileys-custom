// lib.js - Custom Baileys Pairing Code (1 file)
const WebSocket = require('ws')
const readline = require('readline-sync')
const fs = require('fs')
const path = require('path')

const SESSION_FILE = path.join(__dirname, 'session.json')

function generateCustomCode() {
    const prefix = 'CYBER'
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNum}`
}

function connectCustomBaileys() {
    const nomor = readline.question('Masukkan Nomor Anda (contoh 62xxxx): ')

    const ws = new WebSocket('wss://dummy-whatsapp-server.com/pair') // Simulasi websocket pairing

    ws.on('open', () => {
        console.log('\n🟢 Tersambung ke server custom...')
        const payload = {
            action: 'pairing_request',
            phone_number: nomor
        }
        ws.send(JSON.stringify(payload))
    })

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString())
            if (msg.status === 'ok') {
                const pairingCodeCustom = generateCustomCode()
                console.log(`\n✨ Pairing code kamu bro: ${pairingCodeCustom}\n`) // hanya tampil di console

                const session = {
                    nomor,
                    pairing_code: pairingCodeCustom,
                    expired_at: Date.now() + 5 * 60 * 1000
                }

                fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2))
            } else {
                console.log('📩 Server:', msg)
            }
        } catch (err) {
            console.error('❌ Gagal parsing message:', err.message)
        }
    })

    ws.on('close', () => {
        console.log('🔴 Koneksi ditutup.')
    })

    ws.on('error', (err) => {
        console.error('❌ Error koneksi:', err.message)
    })
}

module.exports = {
    connectCustomBaileys
}
