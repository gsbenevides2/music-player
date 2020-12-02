import {Table} from '../tableSchema'

export class MusicsTable extends Table{
 version=1
 create=[
	"CREATE TABLE IF NOT EXISTS musics (",
	"id INTEGER PRIMARY KEY NOT NULL UNIQUE,",
	"name TEXT NOT NULL,",
	"cover_url TEXT NOT NULL,",
	"youtube_id TEXT NOT NULL,",
	"file_uri TEXT,",
	"artist_id INTEGER NOT NULL,",
	"FOREIGN KEY(artist_id) REFERENCES artists(id) ON DELETE CASCADE ON UPDATE CASCADE);"
 ]
}

