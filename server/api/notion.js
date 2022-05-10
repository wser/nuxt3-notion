import { Client } from '@notionhq/client';
import { useBody } from 'h3';

const { NOTION_DATABASE_ID, NOTION_API_KEY } = process.env;

export default async (req, res) => {
  // secret key
  const notion = new Client({ auth: NOTION_API_KEY });

  switch (req.method) {
    case 'POST':
      let content = await useBody(req);
      const obj = JSON.parse(content);
      try {
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
      } catch (err) {
        console.log(err);
      }

    case 'GET':
      // handle GET
      const database = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
          property: 'Status',
          select: { equals: 'Live' },
        },
      });

      const suggestions = [];

      const mapColor = (color) => (color === 'purple' ? 'indigo' : color);

      database.results.map((row) => {
        let colorize = (e) => ({ name: e.name, color: mapColor(e.color) });
        let r = row.properties;

        suggestions.push({
          id: row.id,
          title: r.Title.title[0].text.content,
          description: r.Description.rich_text[0].text.content,
          type: r.Type.multi_select.map((type) => colorize(type)),
          tags: r.Tags.multi_select.map((tag) => colorize(tag)),
          dateCreated: r['Date Created'].created_time,
          votes: r.Votes.number,
          status: r.Status.select.name,
          statusColor: r.Status.select.color,
        });
      });
      return { suggestions };
  }
};
