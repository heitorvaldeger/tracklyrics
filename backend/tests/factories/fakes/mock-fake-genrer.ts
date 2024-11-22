import GenrerLucid from '#models/genrer-model/genrer-lucid'

export const mockFakeGenrer = async () => {
  const genrer = await GenrerLucid.create({
    name: 'any_name',
  })

  return genrer
}
