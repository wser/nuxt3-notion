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
        suggestions.push({
          id: row.id,
          title: row.properties.Title.title[0].text.content,
          description: row.properties.Description.rich_text[0].text.content,
          type: row.properties.Type.multi_select.map((type) => {
            return { name: type.name, color: type.color };
          }),
          tags: row.properties['Tags'].multi_select.map((tag) => {
            return { name: tag.name, color: mapColor(tag.color) };
          }),
          dateCreated: row.properties['Date Created'].created_time,
          votes: row.properties.Votes.number,
        });
      });

      return { suggestions };
      break;
  }

  function mapColor(color) {
    let mappedColor = color;
    color = 'purple' ? (mappedColor = 'indigo') : mappedColor;
    return mappedColor;
  }
};
