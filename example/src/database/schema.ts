import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { Tables } from '../database';

const schema = appSchema({
	version: 1,
	tables: [
		tableSchema({
			name: Tables.posts,
			columns: [
				{ name: 'title', type: 'string' },
				{ name: 'body', type: 'string', isOptional: true },
			],
		}),
		tableSchema({
			name: Tables.comments,
			columns: [
				{ name: 'body', type: 'string' },
				{ name: 'post_id', type: 'string', isIndexed: true },
			],
		}),
	],
});

export default schema;
