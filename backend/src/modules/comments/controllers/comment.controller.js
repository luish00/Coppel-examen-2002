import language from '@google-cloud/language';

const client = new language.LanguageServiceClient();

import commentmodel from '../models/comment.model';

async function analyze({ coments = [], fileName, response = [], user }) {
  if (!coments.length) {
    return response;
  }

  const [coment, ...rest] = coments;

  const document = {
    content: coment,
    type: 'PLAIN_TEXT',
  };
  const [result] = await client.analyzeSentiment({ document });
  const sentiment = result.documentSentiment;

  return analyze({
    coments: rest,
    response: [
      ...response,
      { ...sentiment, user, coment, fileName, createAt: new Date().getTime() },
    ],
    user,
  });
}

export async function craeteAsyn(req, res) {
  try {
    const { content, fileName } = req.body;

    const document = {
      content: content,
      type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;

    const response = {
      ...sentiment,
      coment: content,
      fileName,
      user: req.jwt.name,
      createAt: new Date().getTime(),
    };

    commentmodel.create(response);

    res.status(200).send(response);
  } catch (error) {
    console.log('valio', error.message)
    res.status(500).send('An error ocurred');
  }
}

export async function create(req, res) {
  const { jwt: { name }, body: { contents, fileName } } = req;

  try {
    const response = await analyze({ coments: contents, fileName, user: name });

    commentmodel.inserts(response);

    res.status(200).send(response);
  } catch (error) {
    console.log('valio', error.message)
    res.status(500).send('An error ocurred');
  }
}

export function list(req, res) {
  const { status, clubId } = req.query;
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  const query = {};

  if (req.query && req.query.page) {
    page = parseInt(req.query.page);
    page = Number.isInteger(req.query.page) ? req.query.page : 0;
  }

  if (status) {
    query.status = Boolean(Number.parseInt(status, 2));
  }

  commentmodel.list({ clubId, perPage: limit, page, query })
    .then((result) => {
      res.status(200).send(result);
    }).catch(() => {
      res.status(500).send({});
    });
}

export default { craeteAsyn, create, list }
