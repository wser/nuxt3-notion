import { Client } from '@notionhq/client';
import { useBody } from 'h3';

export default async (req, res) => {
  // secret key
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  switch (req.method) {
    case 'POST':
      let content = await useBody(req);
      const obj = JSON.parse(content);

      notion.pages.update({
        page_id: obj.id,
        properties: {
          Votes: {
            number: obj.votes,
          },
        },
      });
      res.statusCode = 200;
      res.end();
      break;
    case 'GET':
      // handle GET
      const database = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
      });
      const suggestions = [];

      database.results.map((row) => {
        let fun = (e) => {
          return { name: e.name, color: mapColor(e.color) };
        };
        suggestions.push({
          id: row.id,
          title: row.properties.Title.title[0].text.content,
          description: row.properties.Description.rich_text[0].text.content,
          type: row.properties.Type.multi_select.map((type) => fun(type)),
          tags: row.properties.Tags.multi_select.map((tag) => fun(tag)),
          dateCreated: row.properties['Date Created'].created_time,
          votes: row.properties.Votes.number,
        });
      });
      return { suggestions };
      break;
  }

  function mapColor(color) {
    return color === 'purple' ? 'indigo' : color;
  }
};
