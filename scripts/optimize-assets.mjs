import sharp from 'sharp'

const source = 'img/vaelor-home-alturas-3d.png'

await Promise.all([
  sharp(source).resize({ width: 2048 }).avif({ quality: 76 }).toFile('public/new-vaelor-2048.avif'),
  sharp(source).resize({ width: 2048 }).webp({ quality: 86 }).toFile('public/new-vaelor-2048.webp'),
  sharp(source).resize({ width: 1280 }).avif({ quality: 74 }).toFile('public/new-vaelor-1280.avif'),
  sharp(source).resize({ width: 1280 }).webp({ quality: 84 }).toFile('public/new-vaelor-1280.webp'),
])

const scenes = [
  { slug: 'central', source: 'img/scenne/regiao-central-keyart.png' },
  { slug: 'gelo', source: 'img/scenne/regiao-gelo-keyart.png' },
  { slug: 'miyari', source: 'img/scenne/vila-miyari-keyart.png' },
]

await Promise.all(scenes.flatMap(({ slug, source }) => [
  sharp(source).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 90 }).toFile(`public/scenes/${slug}-1920.webp`),
  sharp(source).resize(1080, 1080, { fit: 'cover' }).webp({ quality: 86 }).toFile(`public/scenes/${slug}-1080.webp`),
]))

const characters = ['Akane', 'Fuyuka', 'Miyari']

await Promise.all(characters.flatMap((name) => {
  const sourcePath = `img/chars/${name}-clean.png`
  const slug = name.toLowerCase()
  return [
    sharp(sourcePath).extract({ left: 840, top: 0, width: 832, height: 760 }).webp({ quality: 92 }).toFile(`public/chars/${slug}-art.webp`),
    sharp(sourcePath).extract({ left: 950, top: 20, width: 420, height: 420 }).resize(320, 320).webp({ quality: 90 }).toFile(`public/chars/${slug}-portrait.webp`),
    sharp(sourcePath).extract({ left: 840, top: 0, width: 832, height: 760 }).resize(1280, 900, { fit: 'cover' }).blur(35).webp({ quality: 70 }).toFile(`public/chars/${slug}-ambient.webp`),
  ]
}))

const protagonists = ['Vaelor-man', 'Vaelor-fem']

await Promise.all(protagonists.flatMap((name) => {
  const sourcePath = `img/chars/${name}-clean.png`
  const slug = name.toLowerCase()
  return [
    sharp(sourcePath).extract({ left: 840, top: 0, width: 832, height: 760 }).webp({ quality: 92 }).toFile(`public/chars/${slug}-art.webp`),
    sharp(sourcePath).extract({ left: 950, top: 20, width: 420, height: 420 }).resize(320, 320).webp({ quality: 90 }).toFile(`public/chars/${slug}-portrait.webp`),
    sharp(sourcePath).extract({ left: 840, top: 0, width: 832, height: 760 }).resize(1280, 900, { fit: 'cover' }).blur(35).webp({ quality: 70 }).toFile(`public/chars/${slug}-ambient.webp`),
  ]
}))

const characterBackgrounds = ['fuyuka', 'akane', 'miyari', 'protagonist']

await Promise.all(characterBackgrounds.flatMap((name) => [
  sharp(`img/chars/background-${name}.png`).resize({ width: 2048 }).webp({ quality: 88 }).toFile(`public/chars/background-${name}.webp`),
  sharp(`img/chars/background-${name}.png`).resize({ width: 1280 }).webp({ quality: 84 }).toFile(`public/chars/background-${name}-mobile.webp`),
]))

const fullBodyCharacters = ['Fuyuka', 'Akane', 'Miyari', 'Vaelor-man', 'Vaelor-fem']

await Promise.all(fullBodyCharacters.map((name) =>
  sharp(`img/chars/${name}-fullbody.png`).webp({ quality: 94, alphaQuality: 100 }).toFile(`public/chars/${name.toLowerCase()}-fullbody.webp`)
))
