// eslint-disable-next-line no-use-before-define
import React from 'react'
import { Text } from 'react-native-paper'

import styles from './styles'

export interface MusicDataProps {
  musicName?: string
  artistName?: string
}
export const MusicData: React.FC<MusicDataProps> = props => (
  <>
    <Text style={styles.musicName}>
      {props.musicName || 'Nenhuma música selecionada'}
    </Text>
    <Text style={styles.artistName}>{props.artistName}</Text>
  </>
)
export const MusicDataMemorized = React.memo(MusicData)
