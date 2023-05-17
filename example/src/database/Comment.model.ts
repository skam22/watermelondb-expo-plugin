import { Model, Relation } from '@nozbe/watermelondb';
import { relation, text } from '@nozbe/watermelondb/decorators';
import { BelongsToAssociation } from '@nozbe/watermelondb/Model';

import { Post } from '../database';
import { Tables } from './Tables.enum';

class Comment extends Model {
	static table = Tables.comments;
	static associations = {
		[Tables.posts]: { type: 'belongs_to', key: 'post_id' } as BelongsToAssociation,
	};

	@text('body') body!: string;

	@relation(Tables.posts, 'post_id') post!: Relation<Post>;
}

export default Comment;
