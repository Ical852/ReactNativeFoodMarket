import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Login from "./screens/Login"
import Register from './screens/Register';
import Home from './screens/Home';
import Shop from './screens/Shop';
import Detail from './screens/Detail';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import { StatusBar } from 'react-native';
import Cart from './screens/Cart';
import Success from './screens/Success';
import Transactions from './screens/Transactions';
import Favorite from './screens/Favorite';

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Splash'
        screenOptions={{ headerShown : false }}
      >
        <Stack.Screen name='Splash' component={Splash}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="Detail" component={Detail}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name='Cart' component={Cart}/>
        <Stack.Screen name='Success' component={Success}/>
        <Stack.Screen name='Transaction' component={Transactions} />
        <Stack.Screen name='Favorite' component={Favorite}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App