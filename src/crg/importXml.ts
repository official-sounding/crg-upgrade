export function importXml(data: any): ICrgTeam[] {
    return data.document.Teams[0].Team.map(teamFromXml)
}

function teamFromXml(team: any): ICrgTeam {
    return {
        id: team.$.Id,
        name: team.Name[0],
        alternateNames: alternateNameFromXml(team.AlternateName),
        colors: colorsFromXml(team.Color),
        skaters: skatersFromXml(team.Skater),
    }
}

function alternateNameFromXml(alternateNames: any): ICrgAlternativeName[] {
    const result = []

    if (alternateNames) {
        alternateNames.forEach((an) => {
            result.push({
                id: an.$.Id,
                name: an.Name[0],
            })
        })
    }

    return result
}

function skatersFromXml(skaters: any): ICrgSkater[] {
    const result = []

    if (skaters) {
        skaters.forEach((sk) => {
            result.push({
                id: sk.$.Id,
                name: sk.Name ? sk.Name[0] : '',
                number: sk.Number ? sk.Number[0] : '',
                flags: sk.Flags ? sk.Flags[0] : '',
            })
        })
    }

    return result
}

function colorsFromXml(colors: any): ICrgColor[] {
    const result = []
    if (colors) {
        colors.forEach((co) => {
            result.push({
                id: co.$.Id,
                color: co.Color ? co.Color[0] : '',
            })
        })
    }

    return result
}
