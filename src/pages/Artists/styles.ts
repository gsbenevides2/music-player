import { StyleSheet, StatusBar } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0 + 10,
    alignSelf: 'center'
  },
  artistContainer: {
    margin: '2%'
  },
  artistImage: {
    borderRadius: 50
  },
  artistText: {
    textAlign: 'center'
  }
})
