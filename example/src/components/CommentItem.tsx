/**
 * @format
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../database';

interface Props {
	comment: Comment;
}
const CommentItem = ({ comment }: Props) => {
	return (
		<View key={comment.id} style={styles.container}>
			<Text>{comment.body}</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		marginVertical: 2,
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		padding: 4,
	},
});
export default CommentItem;
