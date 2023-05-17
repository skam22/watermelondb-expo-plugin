/**
 * @format
 */

import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Post, Comment, Tables } from '../database';
import { Collection, Database, Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';

import { CommentItem } from '../components';

interface Props {
	post: Post;
	database: Database;
	comments: Comment[];
}
const RenderPostItem = ({ post, database, comments }: Props) => {
	const [commentText, setCommentText] = useState<string>('');

	const onSubmitEditing = useCallback(async () => {
		const batchedPromises = [];
		const commentCollection: Collection<Comment> = database.get<Comment>(Tables.comments);
		await database.write(async () => {
			batchedPromises.push(
				commentCollection.prepareCreate((newComment) => {
					newComment.post.set(post);
					newComment.body = commentText;
				})
			);
			await database.batch(batchedPromises);
			setCommentText('');
		});
	}, [commentText]);

	const commentMap = useCallback(
		(comment: Comment) => <CommentItem key={comment.id} comment={comment} />,
		[]
	);

	return (
		<View style={styles.container}>
			<Text style={styles.titleText}>Title: {post.title}</Text>
			<Text style={styles.bodyText}>Body: {post.body}</Text>

			<View style={styles.indent}>{comments.map(commentMap)}</View>

			<TextInput
				value={commentText}
				onChangeText={setCommentText}
				placeholder='Enter a comment'
				placeholderTextColor={'rgba(0,0,0,0.5)'}
				style={styles.commentInput}
				onSubmitEditing={onSubmitEditing}
				blurOnSubmit
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
		padding: 10,
		backgroundColor: 'rgba(0,0,0,0.10)',
	},
	titleText: { fontSize: 24, fontWeight: '600' },
	bodyText: { fontSize: 16, fontWeight: '400' },
	indent: { paddingLeft: 6 },
	commentInput: { backgroundColor: 'lightblue', marginTop: 10, borderRadius: 4, padding: 8 },
});

const enhance = withObservables(
	['post', 'comments'],
	({ post }: { post: Post; comments: Comment[] }) => ({
		post,
		comments: post.comments,
	})
);

const EnhancedPostItem = enhance(RenderPostItem);

const PostItem = ({ database, post }: { database: Database; post: Post }) => {
	return <EnhancedPostItem post={post} database={database} />;
};

export default memo(PostItem);
