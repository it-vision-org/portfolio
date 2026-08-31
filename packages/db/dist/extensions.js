"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteExtension = void 0;
const client_1 = require("@prisma/client");
const modelsWithIsDeleted = ["User"];
exports.softDeleteExtension = client_1.Prisma.defineExtension((client) => {
    return client.$extends({
        query: {
            $allModels: {
                async findMany({ args, query, model }) {
                    if (modelsWithIsDeleted.includes(model)) {
                        args.where = { ...args.where, isDeleted: false };
                    }
                    return query(args);
                },
                async findUnique({ args, query, model }) {
                    if (modelsWithIsDeleted.includes(model)) {
                        args.where = { ...args.where, isDeleted: false };
                    }
                    return query(args);
                },
                async findFirst({ args, query, model }) {
                    if (modelsWithIsDeleted.includes(model)) {
                        args.where = { ...args.where, isDeleted: false };
                    }
                    return query(args);
                },
            },
        },
        model: {
            $allModels: {
                async softDelete(where) {
                    if (modelsWithIsDeleted.includes(this.name)) {
                        return this.update({ where, data: { isDeleted: true } });
                    }
                    throw new Error("Model does not support soft delete.");
                },
                async restore(where) {
                    if (modelsWithIsDeleted.includes(this.name)) {
                        return this.update({ where, data: { isDeleted: false } });
                    }
                    throw new Error("Model does not support restore.");
                },
                async findAll(args) {
                    return this.findMany({ ...args, where: { ...args?.where } });
                },
            },
        },
    });
});
