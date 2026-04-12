"use strict";
(() => {
var exports = {};
exports.id = 836;
exports.ids = [836];
exports.modules = {

/***/ 7625:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: external "@prisma/client"
const client_namespaceObject = require("@prisma/client");
;// CONCATENATED MODULE: ./lib/prisma/client.js

const prisma = new client_namespaceObject.PrismaClient();
/* harmony default export */ const client = (prisma);

;// CONCATENATED MODULE: ./src/pages/api/journal.js

const DEFAULT_EMOTIONS = [
    "Fear",
    "Greed",
    "Joy",
    "Neutral"
];
async function ensureBaselineData() {
    const accountCount = await client.userAccount.count();
    if (accountCount === 0) {
        await client.userAccount.create({
            data: {
                name: "Primary Account",
                balance: 0
            }
        });
    }
    for (const name of DEFAULT_EMOTIONS){
        await client.emotion.upsert({
            where: {
                name
            },
            update: {},
            create: {
                name
            }
        });
    }
}
function parseDocuments(rawDocuments) {
    if (!rawDocuments) {
        return [];
    }
    try {
        const parsed = JSON.parse(rawDocuments);
        return Array.isArray(parsed) ? parsed : [];
    } catch  {
        return [];
    }
}
async function handler(req, res) {
    try {
        await ensureBaselineData();
        if (req.method === "GET") {
            const entries = await client.journalEntry.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    emotion: true,
                    account: true
                }
            });
            const normalizedEntries = entries.map((entry)=>({
                    ...entry,
                    documents: parseDocuments(entry.documents)
                }));
            return res.status(200).json(normalizedEntries);
        }
        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed"
            });
        }
        const { symbol, killzone, open, close, risk, accountId, emotionId, notes, documents } = req.body;
        if (!symbol || open === undefined || close === undefined || risk === undefined) {
            return res.status(400).json({
                error: "Missing required trade fields."
            });
        }
        const fallbackAccount = await client.userAccount.findFirst({
            orderBy: {
                id: "asc"
            }
        });
        const fallbackEmotion = await client.emotion.findFirst({
            orderBy: {
                id: "asc"
            }
        });
        const account = accountId ? await client.userAccount.findUnique({
            where: {
                id: Number(accountId)
            }
        }) : fallbackAccount;
        const emotion = emotionId ? await client.emotion.findUnique({
            where: {
                id: Number(emotionId)
            }
        }) : fallbackEmotion;
        if (!account || !emotion) {
            return res.status(400).json({
                error: "Unable to resolve account or emotion."
            });
        }
        const entry = await client.journalEntry.create({
            data: {
                symbol: String(symbol).toUpperCase(),
                killzone: killzone || "N/A",
                open: Number(open),
                close: Number(close),
                risk: Number(risk),
                notes: notes || "",
                documents: JSON.stringify(Array.isArray(documents) ? documents : []),
                accountId: account.id,
                emotionId: emotion.id
            },
            include: {
                emotion: true,
                account: true
            }
        });
        return res.status(201).json({
            ...entry,
            documents: parseDocuments(entry.documents)
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to process journal request."
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(7625));
module.exports = __webpack_exports__;

})();