const champions = ['Veigar', 'Ashe', 'Amumu', 'LeeSin', 'Thresh', 'Shaco',
    'Yasuo', 'Garen', 'Anivia', 'Malphite', 'Ahri', 'Blitzcrank', 'Kassadin', 'Lucian'
]

fetch(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json`).then(response => response.json()).then(async data => {
    return await Promise.all(champions.map(async (name) => {
        const spells = await fetch(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${name}.json`).then(response => response.json()).then(data => {
            return data.data[name].spells.map(spell => {
                return {
                    id: spell.id,
                    name: spell.name,
                    cooldown: spell.cooldown[0],
                    image: spell.image,
                }
            })
        })

        return {
            name: name,
            stats: data.data[name].stats,
            spells: spells,
        }
    }))
}).then(data => console.log(JSON.stringify(data.reduce((result, champ) => {
    result[champ.name] = champ
    return result
}, {})))).then(data => console.log(JSON.stringify(data)))
