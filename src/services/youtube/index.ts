import ytdl from 'react-native-ytdl'

interface YoutubeServiceInterface {
  getVideoIdAndTitle(
    videoUrl: string
  ): Promise<{ generatedMusicName: string; videoId: string }>
  getMusicPlayUrl(videoId: string): Promise<string>
}

export class YoutubeService implements YoutubeServiceInterface {
  async getVideoIdAndTitle(
    videoUrl: string
  ): Promise<{ generatedMusicName: string; videoId: string }> {
    function sanitizerDescription(description: string) {
      const lines = description.split('\n')
      const thirdRow = lines[2] || ''
      const [name, artist] = thirdRow.split(' · ')
      if (artist) return `${name} - ${artist}`
      else return null
    }
    function sanitizerTitle(title: string) {
      const standards = [
        /\(((.)+)?\)/gm, // Rmmove ()
        /\[((.)+)?\]/gm, // Remove []
        /\#([a-zA-Z]+)/gm, // Remove #
        'Oficial',
        'OFICIAL',
        'Official MV',
        'Official',
        'OFFICIAL',
        '"',
        "'"
      ]
      let sanitizedTitle = title
      // eslint-disable-next-line array-callback-return
      standards.map(standard => {
        sanitizedTitle = sanitizedTitle.replace(standard, '')
      })
      return sanitizedTitle
    }

    const results = await ytdl.getInfo(videoUrl)
    const title = results.videoDetails.title
    const description = results.videoDetails.description
    const musicName = sanitizerDescription(description) || sanitizerTitle(title)
    return {
      videoId: results.videoDetails.videoId,
      generatedMusicName: musicName
    }
  }

  async getMusicPlayUrl(videoId: string): Promise<string> {
    const results = await ytdl.getInfo(`https://youtu.be/${videoId}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return results.formats.filter((ele: any) =>
      ele?.mimeType?.includes('audio/mp4')
    )[0].url
  }
}
