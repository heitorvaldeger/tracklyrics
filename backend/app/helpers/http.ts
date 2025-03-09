export const ok = (body: any) => ({
  statusCode: 200,
  body,
})

export const notContent = () => ({
  statusCode: 204,
})

export const badRequest = (body: any) => ({
  statusCode: 400,
  body,
})

export const serverError = (error: any) => ({
  statusCode: 500,
  body: error,
})

export const notFound = (body: any) => ({
  statusCode: 404,
  body,
})

export const unprocessable = (body: any) => ({
  statusCode: 422,
  body,
})

export const unauthorized = (body: any) => ({
  statusCode: 401,
  body,
})
