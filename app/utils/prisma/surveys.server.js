import prisma from '~/utils/prisma/index.server'

export const prismaGetSurvey = async (where) => {
  try {
    await prisma.$connect()
    // const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.Survey.findUnique({
      where,
    })
  } catch (error) {
    await prisma.$disconnect()
    throw new Error(error.message)
  }
}
