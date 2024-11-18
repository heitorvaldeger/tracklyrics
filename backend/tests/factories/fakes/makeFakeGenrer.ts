import GenrerLucid from '#models/genrer/genrer-lucid'

export const makeFakeGenrer = async () => {
  const genrer = await GenrerLucid.create({
    name: 'any_name',
  })

  return genrer
}
