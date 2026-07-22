import sharp from 'sharp'

const [input, output] = process.argv.slice(2)
if (!input || !output) throw new Error('Usage: node scripts/remove-green.mjs <input> <output>')

const image = sharp(input).ensureAlpha()
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })

for (let index = 0; index < data.length; index += 4) {
  const red = data[index]
  const green = data[index + 1]
  const blue = data[index + 2]
  const dominance = green - Math.max(red, blue)
  const saturation = green - Math.min(red, blue)

  let alpha = 255
  if (dominance >= 150 && saturation >= 170) alpha = 0
  else if (dominance > 18 && saturation > 45) alpha = Math.round(255 * (150 - dominance) / 132)

  data[index + 3] = Math.max(0, Math.min(255, alpha))
  if (alpha > 0 && dominance > 5) {
    data[index + 1] = Math.min(green, Math.max(red, blue) + 8)
  }
}

await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(output)
