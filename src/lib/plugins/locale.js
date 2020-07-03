const _ = require("lodash");

module.exports.player = (player, serv) => {
    player._client.on('settings', (packet) => {
        player.lang = packet.locale
    })

    player.localeString = (path) => serv.localeString(player.lang, path)
}

module.exports.server = (serv) => {
    serv.locales = {
        langs: {},
        setStringLang(lang, path, value) {
            serv.locales.langs[lang] = serv.locales.langs[lang] || {}
            _.set(serv.locales.langs[lang], path, { value: value })
        },
        setString: (path, values) => {
            _.map(_.keys(values), lang => {
                serv.locales.langs[lang] = serv.locales.langs[lang] || {}
                let value = values[lang]
                let localPath = path
                _.set(serv.locales.langs[lang], localPath, value)
            })
        },
        getString: (lang = 'en_US', path) => {
            return _.get(serv.locales.langs[lang], path, `\'${path}\' not found`)
        }
    }

    serv.localeString = (lang, path) => serv.locales.getString(lang, path)

    serv.locales.setString('localeTest', {
        en_US: {
            works: 'Localization works!',
            object: {
                hmm: 'Localization works.. hmm...'
            },
            array: ['It works!', 'I\'m array!']
        },
        ru_RU: {
            works: 'Локализация работает!',
            object: {
                hmm: 'Локализация работает.. хмм...'
            },
            array: ['Работает!', 'Я массив!']
        },
    })

    serv.commands.add({
        base: 'localetest',
        info: 'Test localization',
        usage: '/localetest [lang] [where]',
        op: true,
        action(args, ctx) {
            let argsSplit = args.split(' ')
            const lang = argsSplit[0] === '' ? undefined : argsSplit[0]
            const path = 'localeTest' + (argsSplit[1] && argsSplit !== '' ? '.'+argsSplit[1] : '')

            if (ctx.player) {
                if (lang) ctx.player.chat(serv.localeString(lang, path))
                else ctx.player.chat(ctx.player.localeString(path))
            }
            else serv.info(serv.localeString(lang, path))
        }
    })
}