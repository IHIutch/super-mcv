import prisma from '~/utils/prisma/index.server'

export const prismaGetResponses = async (where) => {
  try {
    await prisma.$connect()
    // const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.Response.findMany({
      where,
    })
  } catch (error) {
    await prisma.$disconnect()
    throw new Error(error.message)
  }
}

export const prismaCreateResponse = async (payload) => {
  try {
    await prisma.$connect()
    return await prisma.Response.create({
      data: {
        ...payload,
      },
    })
  } catch (error) {
    await prisma.$disconnect()
    throw new Error(error.message)
  }
}
