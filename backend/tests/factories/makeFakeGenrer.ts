import Genrer from '#models/genrer'

export const makeFakeGenrer = async () => {
  const genrer = await Genrer.create({
    name: 'any_name',
  })

  return genrer
}
