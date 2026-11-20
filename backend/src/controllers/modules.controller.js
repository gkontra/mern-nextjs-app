import { notFound } from '../lib/apiError.js';
import Module from '../models/Module.js';

const PUBLIC_FIELDS = '-_id moduleId title description status imageKey tags';
const MODULE_ID_PATTERN = new RegExp(/^\d+$/);

export const listPublished = async (req, res) => {
  const modules = await Module.find({ status: 'published' }).sort({ moduleId: 1 }).select(PUBLIC_FIELDS).lean();

  res.json(modules);
};

export const getPublished = async (req, res) => {
  const { moduleId } = req.params;
  const module = MODULE_ID_PATTERN.test(moduleId)
    ? await Module.findOne({ moduleId: Number(moduleId), status: 'published' })
        .select(PUBLIC_FIELDS)
        .lean()
    : null;

  if (!module) {
    throw notFound('Dieses Modul gibt es nicht.');
  }

  res.json(module);
};
