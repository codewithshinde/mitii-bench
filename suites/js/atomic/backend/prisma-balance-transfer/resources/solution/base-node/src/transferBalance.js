import { prisma } from "./prismaClient.js";

export async function transferBalance(fromUserId, toUserId, amount) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return prisma.$transaction(async (tx) => {
    const from = await tx.user.findUnique({ where: { id: fromUserId } });
    const to = await tx.user.findUnique({ where: { id: toUserId } });
    if (!from || !to) throw new Error("User not found");
    if (from.balance < amount) throw new Error("Insufficient funds");
    await tx.user.update({ where: { id: fromUserId }, data: { balance: from.balance - amount } });
    await tx.user.update({ where: { id: toUserId }, data: { balance: to.balance + amount } });
    return { from: fromUserId, to: toUserId, amount };
  });
}
