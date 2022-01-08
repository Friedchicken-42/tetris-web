const colorProps = ['r', 'g', 'b'] as const;
type ColorProp = typeof colorProps[number];
export type Color = Record<ColorProp, number>

export const hexToRGB = (hex: string): Color => {
    if(hex.length === 3) {
        hex = hex.split('').map((c: string) => c + c).join('')
    }

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        r: result ? parseInt(result[1], 16) : 0,
        g: result ? parseInt(result[2], 16) : 0,
        b: result ? parseInt(result[3], 16) : 0,
    }
}

export const RGBToHex = (color: Color | null): string => {
    if (!color) return '#000'
    const { r, g, b } = color;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const blend = (color1: Color , color2: Color): Color => {
    let result: Color = { r: 0, g: 0, b: 0 } 
    for (let key of colorProps) {
        result[key] = Math.pow(color1[key], 2) + Math.pow(color2[key], 2)
        result[key] /= 2
        result[key] = Math.round(Math.sqrt(result[key]))
    }

    return result
}
