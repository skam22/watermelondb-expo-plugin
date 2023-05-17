/**
 * @format
 */

import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Collection, Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema, migrations, Post, Comment, Tables } from './database';
import { PostMap } from './components';

const adapter = new SQLiteAdapter({
	schema,
	migrations,
	jsi: true,
	onSetUpError: (error) => console.log('[db] failed to set up', error),
});
export const database = new Database({
	adapter,
	modelClasses: [Post, Comment],
});

export default function App() {
	const [postTitle, setPostTitle] = useState<string>('');
	const [postBody, setPostBody] = useState<string>('');

	const handleSubmit = useCallback(async () => {
		const postCollection: Collection<Post> = database.get(Tables.posts);
		const batchedPromises = [];
		await database.write(async () => {
			batchedPromises.push(
				postCollection.prepareCreate((newPost) => {
					newPost.title = postTitle;
					newPost.body = postBody;
				})
			);
			await database.batch(batchedPromises);
		});
	}, [postTitle, postBody]);

	return (
		<View style={styles.flexOne}>
			<SafeAreaView style={styles.container}>
				<View style={styles.section}>
					<Text style={styles.label}>Title</Text>
					<TextInput
						placeholder='Enter a title'
						value={postTitle}
						onChangeText={setPostTitle}
						blurOnSubmit
						placeholderTextColor={'rgba(0,0,0,0.5)'}
						style={styles.titleInput}
					/>
				</View>
				<View style={styles.section}>
					<Text style={styles.label}>Body</Text>
					<TextInput
						placeholder='Enter a body'
						value={postBody}
						onChangeText={setPostBody}
						blurOnSubmit
						multiline={true}
						placeholderTextColor={'rgba(0,0,0,0.5)'}
						style={styles.bodyInput}
					/>
				</View>

				<Pressable style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Submit</Text>
				</Pressable>

				<View style={styles.spacer} />
				<PostMap database={database} />
				<StatusBar style='auto' />
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingVertical: Platform.OS === 'android' ? 36 : 0,
		marginHorizontal: 24,
	},
	button: {
		backgroundColor: 'teal',
		padding: 8,
		borderRadius: 4,
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	flexOne: { flex: 1, backgroundColor: 'white' },
	section: {
		marginVertical: 8,
	},
	label: {
		fontSize: 24,
		fontWeight: '600',
	},
	titleInput: {
		backgroundColor: 'rgba(0,0,0,0.10)',
		padding: 8,
		borderRadius: 4,
	},
	bodyInput: {
		height: 150,
		backgroundColor: 'rgba(0,0,0,0.10)',
		borderRadius: 4,
		padding: 8,
		textAlignVertical: 'top',
	},
	spacer: {
		height: 15,
	},
});
