import React from 'react';
import Routes from './src/routes';
import {StatusBar} from 'expo-status-bar'

import { Provider, DarkTheme } from 'react-native-paper'
import {DatabaseProvider} from './src/services/database';

export default function App() {
 return (
	<Provider theme={DarkTheme}>
	 <DatabaseProvider>
		<Routes/>
		<StatusBar style='light'/>
	 </DatabaseProvider>
	</Provider>
 )
}

