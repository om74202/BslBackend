//const { PrismaClient } = require('@prisma/client');



//const prismaClient = new PrismaClient();
//module.exports=prismaClient;
// prismaClient.js
// prismaClient.js
const { PrismaClient } = require("@prisma/client");

let prismaClient;

// Reuse existing client if it exists, otherwise create it once
if (!global.__prismaClient) {
  global.__prismaClient = new PrismaClient();
}

prismaClient = global.__prismaClient;

module.exports = prismaClient;

