// import { test } from '@japa/runner'
// import sinon, { stub } from 'sinon'
// import { badRequest, ok, serverError, unprocessable } from '#helpers/http'
// import AuthController from '#controllers/auth-controller'
// import { makeHttpRequest } from '#tests/factories/makeHttpRequest'
// import User from '#models/lucid-orm/user'
// import { randomUUID } from 'node:crypto'
// import { Secret } from '@adonisjs/core/helpers'
// import { AccessToken } from '@adonisjs/auth/access_tokens'

// const makeFakeRequest = () => ({
//   username: 'any_username',
//   email: 'any_mail@mail.com',
//   password: 'any_password',
//   firstName: 'any_firstName',
//   lastName: 'any_lastName',
// })
// const makeSut = () => {
//   const httpContext = makeHttpRequest(makeFakeRequest())

//   const sut = new AuthController()

//   return { sut, httpContext }
// }
// test.group('AuthController.register', (group) => {
//   // group.each.setup(async () => {
//   //   await VideoLucidquery().whereNotNull('id').delete()
//   //   await UserLucid.query().whereNotNull('id').delete()
//   // })

//   group.each.teardown(() => {
//     sinon.reset()
//     sinon.restore()
//   })

//   test('should returns 400 if required fields is not provided', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()

//     stub(httpContext.request, 'body').returns({})
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(
//       badRequest([
//         {
//           field: 'email',
//           message: 'The email field must be defined',
//         },
//         {
//           field: 'password',
//           message: 'The password field must be defined',
//         },
//         {
//           field: 'username',
//           message: 'The username field must be defined',
//         },
//         {
//           field: 'firstName',
//           message: 'The firstName field must be defined',
//         },
//         {
//           field: 'lastName',
//           message: 'The lastName field must be defined',
//         },
//       ])
//     )
//   }).skip()

//   test('should returns 400 if email provided is invalid', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()

//     stub(httpContext.request.body(), 'email').value('invalid_mail')
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(
//       badRequest([
//         {
//           field: 'email',
//           message: 'The email field must be a valid email address',
//         },
//       ])
//     )
//   }).skip()

//   test('should returns 400 if fields provided is less than length valid', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()

//     stub(httpContext.request, 'body').returns({
//       email: 'valid_mail@mail.com',
//       password: 'any',
//       username: 'any',
//       firstName: '',
//       lastName: '',
//     })
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(
//       badRequest([
//         {
//           field: 'password',
//           message: 'The password field must have at least 6 characters',
//         },
//         {
//           field: 'username',
//           message: 'The username field must have at least 4 characters',
//         },
//         {
//           field: 'firstName',
//           message: 'The firstName field must have at least 1 characters',
//         },
//         {
//           field: 'lastName',
//           message: 'The lastName field must have at least 1 characters',
//         },
//       ])
//     )
//   }).skip()

//   test('should returns 422 if email provided already in use', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()

//     await UserLucid.create({
//       ...makeFakeRequest(),
//       uuid: randomUUID(),
//     })
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(
//       unprocessable({
//         message: 'Email or username already in use. Please choose another.',
//       })
//     )
//   }).skip()

//   test('should returns 200 if create user return success', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()
//     const accessToken = new AccessToken({
//       identifier: 'any_id',
//       tokenableId: 1,
//       type: 'any_type',
//       hash: 'any_hash',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       lastUsedAt: null,
//       name: null,
//       expiresAt: null,
//     })
//     stub(accessToken, 'value').value(new Secret('any_token'))
//     stub(UserLucid.accessTokens, 'create').returns(new Promise((resolve) => resolve(accessToken)))
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(
//       ok({
//         type: 'any_type',
//         token: 'any_token',
//       })
//     )
//   }).skip()

//   test('should returns 500 if create user return throws', async ({ expect }) => {
//     const { sut, httpContext } = makeSut()
//     stub(UserLucid.accessTokens, 'create').throws(new Error())
//     const httpResponse = await sut.register(httpContext)

//     expect(httpResponse).toEqual(serverError(new Error()))
//   }).skip()
// })
