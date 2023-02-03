import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, TextInput, Keyboard, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import FoodIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import FIcon from 'react-native-vector-icons/dist/Fontisto'
import LinearGradient from 'react-native-linear-gradient';
import slider from './SLIDER'
import BottomNav from '../component/BottomNav';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId : this.props.route.params.userId,
            isKeyboadVisible: false,
            sliderData : slider.data,
            randData : [],
            kenyangin : [],
            nyegerin : [],
            searchValue : undefined
        };
    }

    getKenyanginNasi = () => {
        fetch('http://10.0.2.2:3000/api/market/category/1', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({kenyangin : json.data})
            this.getKenyanginMie()
        })
        .catch(err => {
            console.log(err)
        })
    }

    getKenyanginMie = () => {
        fetch('http://10.0.2.2:3000/api/market/category/4', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            for (let i = 0; i < json.data.length; i++) {
                this.state.kenyangin.push(json.data[i])
            }
        }) 
        .catch(err => {
            console.log(err)
        })
    }

    getNyegerinKopi = () => {
        fetch('http://10.0.2.2:3000/api/market/category/2', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({nyegerin : json.data})
            this.getNyegerinEs()
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    getNyegerinEs = () => {
        fetch('http://10.0.2.2:3000/api/market/category/6', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            for (let i = 0; i < json.data.length; i++) {
                this.state.nyegerin.push(json.data[i])
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    getRandomMarket = () => {
        fetch('http://10.0.2.2:3000/api/market/getrand', {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({randData : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getRandomMarket()
        this.getKenyanginNasi()
        this.getNyegerinKopi()
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
                        <TouchableOpacity style={styles.headerBar}>
                            <Icon name="bars" size={21} color="white" />
                        </TouchableOpacity>

                        <View style = {styles.headerViewText}>
                            <Text style={styles.headerText}>GO Food Market</Text>
                        </View>

                        <View style = {styles.headerVIcon}>
                            <View style={{ flexDirection : 'row' }}>
                                <TouchableOpacity style={{ marginRight : 20 }} onPress={() => this.props.navigation.navigate('Cart', {
                                    userId: this.state.userId
                                })}>
                                    <Icon name="shopping-basket" size={21} color="white"/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon name="shopping-cart" size={21} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <ScrollView style={styles.mainScrView}>
                    <View style={styles.searchBg}>
                        <TextInput
                            value={this.state.searchValue}
                            onChangeText={text => this.setState({searchValue : text})}
                            placeholder='Search Here'
                            style={styles.srcTxtInput}
                        />
                        <TouchableOpacity style={styles.srcBtn}
                            onPress={() => {
                                this.props.navigation.navigate('Shop', {
                                    userId : this.state.userId,
                                    srcValue : this.state.searchValue
                                })
                                this.setState({searchValue : undefined})
                            }}
                        >
                            <Icon name="search" size={21} color="#4caf50" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headInfo}>
                        <View style={styles.topUpInfo}>   
                            <View style={{ flex : 1 }}>
                                <Icon name="qrcode" size={21} color="#4caf50" />
                            </View>
                            <Text style={{ fontSize : 12 }}>Top Up</Text>
                        </View>

                    <View style={styles.hr1}/>

                    <View style={styles.saldoView}>
                        <View style={styles.saldoViewIn}>
                            <Icon name="money-bill-wave-alt" size={21} color="#4caf50" />
                            <Text style={styles.hdInfoTxt}>Rp. 150.000</Text>
                        </View>
                        <Text style={{ fontSize : 12 }}>Saldo Anda Saat Ini</Text>
                    </View>

                    <View style={styles.hr2}/>
                        <View style={{ flex : 1, marginHorizontal : 10 }}>
                            <View style={{ flexDirection : 'row'}}>
                                <Icon name="coins" size={21} color="#4caf50" />
                                <Text style={styles.hdInfoTxt}>3450 C</Text>
                            </View>
                            <Text style={{ fontSize : 12 }}>Bonus Poin Anda</Text>
                        </View>
                    </View>

                    <View
                        style={{ 
                            flexDirection : 'row',
                            marginHorizontal : 20,
                            marginTop : 20,
                            marginBottom : 10
                        }}
                    >
                        <Text
                            style={{ 
                                flex  : 1,
                                fontWeight : '900'
                            }}
                        >All Promos Today <Text style={{ fontWeight : '500' }}> -  Free Ongkir</Text></Text>
                        <Text
                            style={{
                                fontWeight : '900',
                                color : 'orange'
                            }}
                        >50% Off</Text>
                    </View>

                    <View style={{ 
                        borderBottomColor: 'grey',
                        borderBottomWidth: 0.2,
                        marginHorizontal : 15
                     }} />

                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={this.state.sliderData}
                            keyExtractor={this.state.sliderData.title}
                            renderItem={({item, index}) => (
                                <View
                                    style={{ 
                                        margin : 10,
                                        padding : 10,
                                        backgroundColor : 'white',
                                        elevation : 5,
                                        borderRadius : 10
                                    }}
                                >
                                    <Image
                                        style={{ height : 100, width : 200, borderRadius : 10 }}
                                        source={{ uri : 'http://10.0.2.2:8000/static/slider/'+ item.img }}
                                    />

                                    <View
                                        style={{ 
                                             flexDirection : 'row',
                                             marginTop : 5
                                        }}
                                    >
                                        <Text
                                            style={{ flex : 1, fontWeight : '900' }}
                                        >{item.title}</Text>
                                        <Text style={{ color : 'orange', fontWeight : '900' }}>{item.promo}</Text>
                                    </View>

                                </View>
                            )}
                        />
                    </View>

                    <View
                        style={{
                            margin : 15,
                            flexDirection : 'row'
                        }}
                    >
                        <Text style={{ fontWeight : 'bold' }}>Food Category</Text>
                        <Text style={{ fontWeight: '400' }}> - Tap to choose your fav category</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flexDirection : 'row', marginTop : 10 }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 1, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30}}
                        >
                            <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <FoodIcon name="rice" size={25} color="#4caf50" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Nasi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 2, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30}}
                        >
                             <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <FIcon name="coffeescript" size={25} color="#8d6e63" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Kopi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 3, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30}}
                        >
                             <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <FoodIcon name="cupcake" size={25} color="#ec407a" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Dessert</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 4, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30}}
                        >
                             <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <FoodIcon name="noodles" size={25} color="#fdd835" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Mie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 5, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30}}
                        >
                             <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <Icon name="carrot" size={25} color="#ff9800" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Sayuran</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Shop', { catValue : 6, userId : this.state.userId })}
                            style = {{ justifyContent : 'center', alignItems : 'center', marginLeft : 30, marginRight : 30}}
                        >
                             <View style={{ backgroundColor:'white', elevation : 3, padding : 15, borderRadius : 10 }}>
                                <FoodIcon name="glass-mug" size={25} color="#2196f3" />
                            </View>
                            <Text style={{ marginTop : 5, fontWeight : 'bold' }}>Es</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={{
                        marginTop : 30,
                        borderBottomColor: '#eeeeee',
                        borderBottomWidth: 12,
                    }}/>

                    <View style={{ marginTop : 10, marginBottom : 20 }}>
                        <View style={{ flexDirection : 'row', marginHorizontal : 15, alignItems : 'center' }}>
                            <Text style={{ flex : 1, color : '#4caf50', fontWeight : '900', fontSize : 18 }}>Terlaris Hari Ini</Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Shop', {
                                    userId : this.state.userId
                                })}
                            >
                                <Text style={{ color : 'orange' }}>Cek Shop &gt;&gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop : 10 }}
                            horizontal
                            data={this.state.randData}
                            keyExtractor={this.state.randData.id}
                            renderItem={({item, index}) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => this.props.navigation.navigate('Detail', {
                                        userId : this.state.userId,
                                        marketId : item.id
                                    })}
                                    style={{ 
                                        justifyContent : 'center',
                                        width : 150,
                                        padding : 15,
                                        elevation : 5,
                                        backgroundColor : 'white',
                                        marginVertical : 10,
                                        marginHorizontal : 10,
                                        borderRadius : 15
                                    }}
                                >
                                    <Image
                                        style={{ width : 120, height : 120, borderRadius : 5 }}
                                        source={{ uri : 'http://10.0.2.2:8000/static/'+ item.market_img }}
                                    />
                                    <View style={{ flex : 1 }}>
                                        <Text
                                            style={{ 
                                                marginTop : 5,
                                                fontWeight : 'bold'
                                             }}
                                        >{item.market_name}</Text>
                                        <View style={{ flexDirection : 'row', marginTop : 3 }}>
                                            <FoodIcon name="star" size={20} color="#4caf50" />
                                            <Text>{item.market_rating}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <View style={{
                        borderBottomColor: '#eeeeee',
                        borderBottomWidth: 12,
                    }}/>

                    <View style={{ marginTop : 10, marginBottom : 20 }}>
                        <View style={{ flexDirection : 'row', marginHorizontal : 15, alignItems : 'center' }}>
                            <Text style={{ flex : 1, color : '#4caf50', fontWeight : '900', fontSize : 18 }}>Favorit Kenyangin</Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Shop', {
                                    userId : this.state.userId
                                })}
                            >
                                <Text style={{ color : 'orange' }}>Cek Shop &gt;&gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop : 10 }}
                            horizontal
                            data={this.state.kenyangin}
                            keyExtractor={this.state.kenyangin.id}
                            renderItem={({item, index}) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => this.props.navigation.navigate('Detail', {
                                        userId : this.state.userId,
                                        marketId : item.id
                                    })}
                                    style={{ 
                                        justifyContent : 'center',
                                        width : 150,
                                        padding : 15,
                                        elevation : 5,
                                        backgroundColor : 'white',
                                        marginVertical : 10,
                                        marginHorizontal : 10,
                                        borderRadius : 15
                                    }}
                                >
                                    <Image
                                        style={{ width : 120, height : 120, borderRadius : 5 }}
                                        source={{ uri : 'http://10.0.2.2:8000/static/'+ item.market_img }}
                                    />
                                    <View style={{ flex : 1 }}>
                                        <Text
                                            style={{ 
                                                marginTop : 5,
                                                fontWeight : 'bold'
                                             }}
                                        >{item.market_name}</Text>
                                        <View style={{ flexDirection : 'row', marginTop : 3 }}>
                                            <FoodIcon name="star" size={20} color="#4caf50" />
                                            <Text>{item.market_rating}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <View style={{
                        borderBottomColor: '#eeeeee',
                        borderBottomWidth: 12,
                    }}/>

                    <View style={{ marginTop : 10, marginBottom : 20 }}>
                        <View style={{ flexDirection : 'row', marginHorizontal : 15, alignItems : 'center' }}>
                            <Text style={{ flex : 1, color : '#4caf50', fontWeight : '900', fontSize : 18 }}>Favorit Nyegerin</Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Shop', {
                                    userId : this.state.userId
                                })}
                            >
                                <Text style={{ color : 'orange' }}>Cek Shop &gt;&gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop : 10 }}
                            horizontal
                            data={this.state.nyegerin}
                            keyExtractor={this.state.nyegerin.id}
                            renderItem={({item, index}) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => this.props.navigation.navigate('Detail', {
                                        userId : this.state.userId,
                                        marketId : item.id
                                    })}
                                    style={{ 
                                        justifyContent : 'center',
                                        width : 150,
                                        padding : 15,
                                        elevation : 5,
                                        backgroundColor : 'white',
                                        marginVertical : 10,
                                        marginHorizontal : 10,
                                        borderRadius : 15
                                    }}
                                >
                                    <Image
                                        style={{ width : 120, height : 120, borderRadius: 5 }}
                                        source={{ uri : 'http://10.0.2.2:8000/static/'+ item.market_img }}
                                    />
                                    <View style={{ flex : 1 }}>
                                        <Text
                                            style={{ 
                                                marginTop : 5,
                                                fontWeight : 'bold'
                                             }}
                                        >{item.market_name}</Text>
                                        <View style={{ flexDirection : 'row', marginTop : 3 }}>
                                            <FoodIcon name="star" size={20} color="#4caf50" />
                                            <Text>{item.market_rating}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('Shop', {
                            userId : this.state.userId
                        })}
                        style={{ marginTop : 20, marginBottom : 40, justifyContent : 'center', alignItems : 'center' }}>
                        <Text style={{ fontSize : 16, fontWeight : 'bold', color : '#4caf50' }}>Lanjut Ke Shop &gt;&gt;</Text>
                    </TouchableOpacity>
 
                </ScrollView>
                
                {!this.state.isKeyboadVisible && (
                    <BottomNav navigation={this.props.navigation} userId={this.state.userId} current={"Home"}/>
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
        flexDirection: 'row'
    },
    headerBar : {
       justifyContent: 'center', 
       alignItems: 'flex-start', 
       flex: 1
    },
    headerViewText : {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1
    },
    headerText : {
       fontSize: 18, 
       color: 'white', 
       fontWeight: '900'
    },
    headerVIcon : {
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        flex: 1
    },
    mainScrView : {
        flex: 1,
        backgroundColor: 'white',
    },
    searchBg : {
        backgroundColor: '#4caf50',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 30,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    srcTxtInput : {
        backgroundColor: 'white', 
        height: 38, width: '90%', 
        borderRadius: 10, 
        paddingHorizontal: 15
    },
    srcBtn : {
        backgroundColor: 'white',
        marginRight: 20,
        marginLeft: -40
    },
    headInfo : {
        backgroundColor: 'white',
        marginHorizontal: 20,
        flexDirection: 'row',
        padding: 10,
        marginTop: -15,
        borderRadius: 10,
        elevation: 5,
    },
    topUpInfo : {
        marginLeft: 10, 
        marginRight: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    hr1 : {
        backgroundColor: '#bdbdbd', 
        height: '100%', 
        width: 1, 
        justifyContent: 'center'
    },
    saldoView : {
        flex: 1, 
        marginHorizontal: 10
    },
    saldoViewIn : {
        flexDirection: 'row',
        flex: 1
    },
    hdInfoTxt : {
        marginLeft: 5, 
        fontWeight: 'bold'
    },
    hr2 : {
        backgroundColor: '#e0e0e0', 
        height: '100%', 
        width: 1, 
        justifyContent: 'center'
    }
})

export default Home;