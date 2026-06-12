import { prisma } from '../routes';

export const productRepository = {
   getProduct(productId: number) {
      return prisma.product.findUnique({ where: { id: productId } });
   },
};
