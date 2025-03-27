import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const post = sqliteTable('post', {
	id: text('id').primaryKey(),
	date: text('date').notNull(),
	published: integer('published', { mode: 'boolean' }).notNull(),
	title: text('title').notNull(),
	text: text('text').notNull(),
	slug: text('slug').notNull().unique(),
	tags: text('tags', { mode: 'json' })
		.$type<string[]>()
		.default(sql`'[]'`)
		.notNull(),
})

// TODO: indexes
