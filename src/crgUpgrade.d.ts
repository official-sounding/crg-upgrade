declare interface ICrgSkater {
    id: string,
    flags: string,
    number: string,
    name: string
}

declare interface ICrgTeam {
    id: string,
    name: string,
    alternateNames: Array<ICrgAlternativeName>,
    colors: Array<ICrgColor>,
    skaters: Array<ICrgSkater>
}

declare interface ICrgAlternativeName {
    id: string,
    name: string,
}

declare interface ICrgColor {
    id: string,
    color: string
}