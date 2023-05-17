import { Model, Query } from '@nozbe/watermelondb';
import { children, text } from '@nozbe/watermelondb/decorators';
import { HasManyAssociation } from '@nozbe/watermelondb/Model';

import { Comment } from '../database';
import { Tables } from './Tables.enum';

class Post extends Model {
	static table = Tables.posts;
	static associations = {
		[Tables.comments]: { type: 'has_many', foreignKey: 'post_id' } as HasManyAssociation,
	};

	@text('title') title!: string;
	@text('body') body?: string;

	@children(Tables.comments) comments!: Query<Comment>;
}

export default Post;
