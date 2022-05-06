import { Client } from '@notionhq/client';
import { useBody } from 'h3';

export default async (req, res) => {
  // secret key
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  if (req.method === 'POST') {
    // handle POST
    let content = await useBody(req);
    notion.pages.update({
      page_id: content.id,
      properties: {
        Votes: {
          number: content.votes,
        },
      },
    });
    res.statusCode = 200;
    res.end();
  } else {
    // handle GET
    const database = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    const suggestions = [];

    database.results.map((row) => {
      suggestions.push({
        id: row.id,
        title: row.properties.Title.title[0].text.content,
        type: row.properties.Type.multi_select.map((typee) => {
          return { name: typee.name, color: typee.color };
        }),
        tags: row.properties.Type.multi_select.map((tag) => {
          return { name: tag.name, color: mapColor(tag.color) };
        }),
        votes: row.properties.Votes.number,
        dateCreated: row.properties['Date Created'].created_time,
      });
    });

    return { suggestions };
  }

  function mapColor(color) {
    let mappedColor = color;
    if ((color = 'purple')) {
      mappedColor = 'indigo';
    }
    return mappedColor;
  }
};
