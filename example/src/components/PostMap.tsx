/**
 * @format
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';

import PostItem from './PostItem';
import { Post } from '../database';
import { Tables } from '../database/Tables.enum';

interface Props {
	posts: Post[];
	database: Database;
}

const RenderPostMap = ({ posts, database }: Props) => {
	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				{posts.map((post) => (
					<PostItem post={post} database={database} key={post.id} />
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
});

const enhance = withObservables(['posts'], ({ posts }: Props) => ({
	posts,
}));

const EnhancedPostMap = enhance(RenderPostMap);

const PostMap = ({ database }: { database: Database }) => {
	const posts = database.get<Post>(Tables.posts).query();
	return <EnhancedPostMap posts={posts} database={database} />;
};

export default PostMap;
