import { test } from '@japa/runner'
import sinon, { spy, stub } from 'sinon'

import ServerMiddleware from '#middleware/server_middleware'
import { makeHttpRequest } from '#tests/__utils__/makeHttpRequest'

const makeSut = () => {
  const sut = new ServerMiddleware()
  const httpContext = makeHttpRequest({}, {})

  stub(httpContext, 'response').value({
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
    getStatus: sinon.stub().returnsThis(),
    getBody: sinon.stub().returns({
      statusCode: 200,
      body: { data: 'success' },
    }),
  })

  const next = sinon.stub().resolves()

  return {
    sut,
    next,
    httpContext,
  }
}

test.group('ServerMiddleware', (group) => {
  group.tap((t) => {
    t.options.title = `it must ${t.options.title}`
  })

  test('define the header "accept" like "application/json"', async ({ expect }) => {
    const { sut, httpContext, next } = makeSut()
    const headersSpy = spy(httpContext.request, 'headers')
    await sut.handle(httpContext, next)

    expect(httpContext.request.headers().accept).toBe('application/json')
    expect(headersSpy.called).toBeTruthy()
  })

  test('return response correctly for diferent status 500', async ({ expect }) => {
    const { sut, httpContext, next } = makeSut()

    await sut.handle(httpContext, next)

    const response = httpContext.response
    expect(response.getBody().statusCode).toBe(200)
    expect(response.getBody().body).toEqual({ data: 'success' })
  })

  test('return 500 with message and stack error', async ({ expect }) => {
    const { sut, httpContext, next } = makeSut()
    const errorBody = {
      message: 'Internal server error',
      stack: 'Error: Internal server error\n at Object.<anonymous> ...',
    }

    stub(httpContext, 'response').value({
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      getStatus: sinon.stub().returnsThis(),
      getBody: sinon.stub().returns({ statusCode: 500, body: errorBody }),
    })

    await sut.handle(httpContext, next)

    expect(httpContext.response.getBody()).toEqual({ statusCode: 500, body: errorBody })
  })
})
