export const insertOnly = async (Model, docs, key) => {
  const now = new Date();
  const operations = [];

  for (const doc of docs) {
    const document = new Model(doc);
    await document.validate();
    operations.push({
      updateOne: {
        filter: { [key]: doc[key] },
        update: { $setOnInsert: { ...document.toObject(), createdAt: now, updatedAt: now } },
        upsert: true,
      },
    });
  }

  const result = await Model.bulkWrite(operations, { timestamps: false });
  const insertedIndexes = Object.keys(result.upsertedIds).map(Number);

  return { inserted: insertedIndexes, existing: docs.length - insertedIndexes.length };
};

export default insertOnly;
