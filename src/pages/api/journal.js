import prisma from '../../../lib/prisma/client';

const DEFAULT_EMOTIONS = ['Fear', 'Greed', 'Joy', 'Neutral'];

async function ensureBaselineData() {
  const accountCount = await prisma.userAccount.count();
  if (accountCount === 0) {
    await prisma.userAccount.create({
      data: {
        name: 'Primary Account',
        balance: 0,
      },
    });
  }

  for (const name of DEFAULT_EMOTIONS) {
    await prisma.emotion.upsert({
      where: { name },
      update: {},
      create: { name },
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
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  try {
    await ensureBaselineData();

    if (req.method === 'GET') {
      const entries = await prisma.journalEntry.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          emotion: true,
          account: true,
        },
      });

      const normalizedEntries = entries.map((entry) => ({
        ...entry,
        documents: parseDocuments(entry.documents),
      }));

      return res.status(200).json(normalizedEntries);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      symbol,
      killzone,
      open,
      close,
      risk,
      accountId,
      emotionId,
      notes,
      documents,
    } = req.body;

    if (!symbol || open === undefined || close === undefined || risk === undefined) {
      return res.status(400).json({ error: 'Missing required trade fields.' });
    }

    const fallbackAccount = await prisma.userAccount.findFirst({ orderBy: { id: 'asc' } });
    const fallbackEmotion = await prisma.emotion.findFirst({ orderBy: { id: 'asc' } });

    const account = accountId
      ? await prisma.userAccount.findUnique({ where: { id: Number(accountId) } })
      : fallbackAccount;
    const emotion = emotionId
      ? await prisma.emotion.findUnique({ where: { id: Number(emotionId) } })
      : fallbackEmotion;

    if (!account || !emotion) {
      return res.status(400).json({ error: 'Unable to resolve account or emotion.' });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        symbol: String(symbol).toUpperCase(),
        killzone: killzone || 'N/A',
        open: Number(open),
        close: Number(close),
        risk: Number(risk),
        notes: notes || '',
        documents: JSON.stringify(Array.isArray(documents) ? documents : []),
        accountId: account.id,
        emotionId: emotion.id,
      },
      include: {
        emotion: true,
        account: true,
      },
    });

    return res.status(201).json({
      ...entry,
      documents: parseDocuments(entry.documents),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process journal request.' });
  }
}
