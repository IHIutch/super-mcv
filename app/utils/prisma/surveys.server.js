import prisma from '~/utils/prisma/index.server'

export const prismaGetSurvey = async (where) => {
  try {
    // const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.Survey.findUnique({
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaCreateSurvey = async (payload) => {
  try {
    // const validWhere = await menuItemSchema.validateAsync(where)
    return await prisma.Survey.create({
      data: {
        ...payload,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
