import db from '@/src/server/db';
import { ProductModel } from '@/src/server/model/Product';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const field = req.query.field ? (req.query.field as string) : 'createdAt';
  const sort = req.query.sort ? (req.query.sort as string) : 'desc';

  await db.connect();
  const data = await ProductModel.paginate(
    {},
    { page, limit, sort: { [field]: sort } }
  );
  await db.disconnect();

  res.json(data);
});

export default handler;
