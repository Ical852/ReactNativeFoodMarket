import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'

const BottomNav = ({navigation, userId, current}) => {
  return (
    <View 
        style = {{
            backgroundColor: 'white',
            padding: 10,
            flexDirection: 'row',
            shadowRadius: 3,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowColor: '#000000',
            elevation: 10,
        }}>
        <TouchableOpacity
            onPress={() => navigation.navigate('Home', {
                userId : userId
            })}
            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
        >
            <Icon name="home" size={21} color={ current == 'Home' ? "#43a047" : '#ababab'} />
            <Text style={{ fontSize : 12, color: current == "Home" ? "#43a047" : '#ababab' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('Transaction', {
                userId : userId
            })}
            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
        >
            <Icon name="credit-card" size={21} color={current == "Transaction" ? "#43a047" : "#ababab"} />
            <Text style={{ fontSize : 12, color: current == "Transaction" ? "#43a047" : '#ababab' }}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('Shop', {
                userId : userId
            })}
            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
        >
            <Icon name="store" size={21} color={ current == 'Shop' ? "#43a047" : '#ababab'} />
            <Text style={{ fontSize : 12, color: current == "Shop" ? "#43a047" : '#ababab' }}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('Favorite', {
                userId: userId
            })}
            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
        >
            { current == 'Favourite' ? <AntIcon name="heart" size={21} color="#4caf50" /> : <Icon name="heart" size={21} color="grey" />} 
            <Text style={{ fontSize : 12, color: current == "Favourite" ? "#43a047" : '#ababab' }}>Favourite</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => navigation.navigate('Profile', {
                userId : userId
            })}
            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
        >
            <Icon name={ current == 'Profile' ? "user-alt" : 'user'} size={21} color={ current == 'Profile' ? "#43a047" : '#ababab'}/>
            <Text style={{ fontSize : 12, color: current == "Profile" ? "#43a047" : '#ababab' }}>Profile</Text>
        </TouchableOpacity>
    </View>
  )
}

export default BottomNav

const styles = StyleSheet.create({})