import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StatusBar, Keyboard, StyleSheet, ScrollView, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { FlatGrid } from 'react-native-super-grid';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import FoodIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/dist/Ionicons'

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.route.params.userId,
            searchValue : this.props.route.params.srcValue,
            catValue : this.props.route.params.catValue,
            isKeyboadVisible: false,
            category : [],
            market : [],
            showData : [],
            searchShop : ''
         };
    }

    loadDataValidation = () => {
        if (this.state.searchValue != undefined) {
            this.getByMoveSearch()
        } else if (this.state.catValue != undefined) {
            this.getByCategory(this.state.catValue)
        } else {
            this.getAllMarket()
        }
    }

    getByMoveSearch = () => {
        fetch('http://10.0.2.2:3000/api/market/search/'+this.state.searchValue, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({market : json.data})
            this._keyboardDidHide()
        })
        .catch(err => {
            console.log(err)
        })
    }

    getBySearch = () => {
        if (this.state.searchShop == '') {
            this.getAllMarket()
        } else {
            fetch('http://10.0.2.2:3000/api/market/search/'+this.state.searchShop, {
                method : 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                }
            })
            .then(response => response.json())
            .then(json => {
                this.setState({market : json.data})
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    getByCategory = (id) => {
        fetch('http://10.0.2.2:3000/api/market/category/'+id, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({market : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    getAllMarket = () => {
        fetch('http://10.0.2.2:3000/api/market/get', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({market : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    getCategory = () => {
        fetch('http://10.0.2.2:3000/api/category/get', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({category : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getCategory()
        this.loadDataValidation()
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this._keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this._keyboardDidHide
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            isKeyboadVisible: true
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            isKeyboadVisible: false
        });
    };

    render() {
        return (
            <View style={{ flex : 1, backgroundColor : 'white' }}>
                <StatusBar backgroundColor={'#66bb6a'}/>
                <View>
                    <LinearGradient
                        style={styles.header}
                        colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                        <TouchableOpacity 
                            style={styles.headerBar}
                            onPress={() => this.props.navigation.goBack({
                                userId : this.state.userId
                            })}
                        >
                            <Icon name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>

                        <View style = {styles.headerViewText}>
                            <TextInput
                                onChangeText={text => this.setState({searchShop : text})}
                                placeholder='Search Your Stuff Here'
                                style = {{ 
                                    backgroundColor: 'white', 
                                    height: 38, width: '90%', 
                                    borderRadius: 10, 
                                    paddingHorizontal: 15
                                 }}
                            />
                            <TouchableOpacity
                                onPress={() => this.getBySearch()} 
                                style={{ 
                                    backgroundColor: 'white',
                                        marginRight: 20,
                                        marginLeft: -40
                                }}>
                                <Icon name="search" size={21} color="#4caf50" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        style={{ backgroundColor : 'white', elevation : 5 }}
                        horizontal
                        data={this.state.category}
                        keyExtractor={this.state.category.id}
                        renderItem={({item, index}) => (
                            <TouchableOpacity
                                onPress={() => this.getByCategory(item.id)}
                                style={{ 
                                    margin : 10,
                                    backgroundColor : 'white',
                                    elevation : 5,
                                    padding : 10,
                                    borderRadius : 10
                                 }}
                            >   
                                <Text
                                    style={{ fontSize : 15, fontWeight : 'bold' }}
                                >{item.category_name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={{ flex : 1, backgroundColor : 'white' }}>
                    <FlatGrid
                        style={{ backgroundColor : 'white' }}
                        itemDimension={250}
                        data={this.state.market}
                        keyExtractor={this.state.market.id}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Detail', {
                                    userId : this.state.userId,
                                    marketId : item.id
                                })}
                                style={{ 
                                    backgroundColor : 'white',
                                    elevation : 5,
                                    padding : 10,
                                    borderRadius : 10,
                                    flexDirection : 'row'
                                 }}
                            >
                                <Image
                                    style={{ width : 120, height : 120 }}
                                    source={{ uri : 'http://10.0.2.2:8000/static/'+ item.market_img }}
                                />
                                <View style={{ flex : 1, marginLeft : 10 }}>
                                    <View style={{ flexDirection : 'row', alignItems : 'center' }}>
                                        <AntIcon name="checksquare" size={21} color="#4caf50" />
                                        <Text style={{ fontWeight : '500', fontSize : 16 }}> {item.market_name}</Text>
                                    </View>
                                    <Text style={{ fontSize : 12.5, marginTop : 5 }}>{item.market_product_name}</Text>
                                    <View style={{ flexDirection : 'row', marginTop : 3, flex : 1 }}>
                                        <View style={{ flexDirection : 'row' }}>
                                            <FoodIcon name="star" size={20} color="orange" />
                                            <Text>{item.market_rating}</Text>
                                        </View>

                                        <View style={{ marginLeft : 10, flexDirection : 'row' }}>
                                            <IonIcon name="location" size={18} color="#d32f2f" />
                                            <Text>{item.market_location}</Text>
                                        </View>
                                        <View style={{ marginLeft : 10, flexDirection : 'row' }}>
                                            <IonIcon name="time" size={18} color="#009688" />
                                            <Text>{item.market_estimate}</Text>
                                        </View>
                                    </View>

                                     <View style={{ flexDirection : 'row' }}>
                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3 }}>Discount 50%</Text>
                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3, marginLeft : 10 }}>Free Ongkir</Text>
                                    </View>
                                </View>
                               
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {!this.state.isKeyboadVisible && (
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
                            onPress={() => this.props.navigation.navigate('Home', {
                                userId : this.state.userId
                            })}
                            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
                        >
                            <Icon name="home" size={21} color="#ababab" />
                            <Text style={{ fontSize : 12 }}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
                        >
                            <Icon name="credit-card" size={21} color="#ababab" />
                            <Text style={{ fontSize : 12 }}>Transaction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
                        >
                            <Icon name="store" size={21} color="#43a047" />
                            <Text style={{ fontSize : 12 }}>Shop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
                        >
                            <Icon name="heart" size={21} color="grey" />
                            <Text style={{ fontSize : 12 }}>Favourite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{ justifyContent : 'center', alignItems : 'center', flex : 1}}
                        >
                            <Icon name="user" size={21} color="grey"/>
                            <Text style={{ fontSize : 12 }}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header : {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
        flexDirection: 'row',
        elevation : 5
    },
    headerBar : {
       justifyContent: 'center', 
       alignItems: 'flex-start', 
    },
    headerViewText : {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1,
        flexDirection : 'row'
    },
    headerText : {
       fontSize: 18, 
       color: 'white', 
       fontWeight: '900'
    },
})

export default Shop;