import prisma from '~/utils/prisma/index.server'

export const prismaGetResponses = async (where) => {
  try {
    // const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.Response.findMany({
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaCreateResponse = async (payload) => {
  try {
    return await prisma.Response.create({
      data: {
        ...payload,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
