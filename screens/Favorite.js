import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Keyboard } from "react-native";
import React, { Component } from 'react';
import BottomNav from "../component/BottomNav";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { Fav, Filter } from "../assets";
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import FoodIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/dist/Ionicons'

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId: this.props.route.params.userId,
            markets : [],
            isKeyboadVisible: false,
            favouriteds : []
         };
    }

    unfavItem = (id) => {
        const filtered = this.state.favouriteds.filter(favorite => favorite.id != id)
        this.setState({favouriteds : filtered})

        fetch('http://10.0.2.2:3000/api/favourite/delete', {
            method : 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body : JSON.stringify({
                "market_id": parseInt(id),
                "user_id": this.state.userId
            })
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
        })
        .catch(err => {
            console.log(err)
        })
    }

    getRandMarket = () => {
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
            this.setState({markets : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    getAllFavourtie = async () => {
        await fetch('http://10.0.2.2:3000/api/favourite/get/' + this.state.userId, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(async json => {
            console.log(json)
            let datamarket = []
            await json.data.map(async data => {
                await fetch('http://10.0.2.2:3000/api/market/detail/' + data.market_id, {
                    method : 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-API-Key': 'RAHASIA'
                    }
                })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    datamarket.push(json.data)
                    this.setState({favouriteds: datamarket})
                })
                .catch(err => {
                    console.log(err)
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.getAllFavourtie()
        this.getRandMarket()
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
            <View style={styles.container}>
                <View style={styles.headercontent}>
                    <View
                        style={styles.header}>
                        <TouchableOpacity style={styles.headerBar}>
                            <Icon name="bars" size={21} color="#4caf50" />
                        </TouchableOpacity>

                        <View style = {styles.headerViewText}>
                            <Text style={styles.headerText}>Your Favourite</Text>
                        </View>

                        <View style = {styles.headerVIcon}>
                            <View style={{ flexDirection : 'row' }}>
                                <TouchableOpacity style={{ marginRight : 20 }} onPress={() => this.props.navigation.navigate('Cart', {
                                    userId: this.state.userId
                                })}>
                                    <Icon name="shopping-basket" size={21} color="#4caf50"/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon name="shopping-cart" size={21} color="#4caf50" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.toptitle}>
                            <Text style={styles.maintitle}>Hello</Text>
                            <Text style={styles.bigtitle}>Find your favourite markets</Text>
                        </View>
                        
                        <View style={styles.inputtop}>
                            <View style={styles.textinput}>
                                <Icon name="search" size={21} color="#DEDEDE" />
                                <TextInput
                                    style={styles.inputext}
                                    placeholder="Search Your Favourite Market Here"
                                />
                            </View>
                            <TouchableOpacity activeOpacity={0.5}>
                                <LinearGradient
                                        style={styles.filterbtn}
                                        colors={['#66bb6a', '#66bb6a', '#4caf50']}
                                    >
                                    <Image style={styles.filtericon} source={Filter}/>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.popularmarket}>Popular Market</Text>

                        <ScrollView style={styles.poplarContent} showsHorizontalScrollIndicator={false} horizontal={true}>
                            <View style={{width: 24}}/>
                            {
                                this.state.markets.length > 0 &&
                                (
                                    this.state.markets.map(item => {
                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                activeOpacity={0.9}
                                                onPress={() => this.props.navigation.navigate('Detail', {
                                                    userId : this.state.userId,
                                                    marketId : item.id
                                                })}
                                                style={{ 
                                                    backgroundColor : 'white',
                                                    elevation : 5,
                                                    padding : 10,
                                                    borderRadius : 10,
                                                    marginBottom: 32,
                                                    marginRight: 16,
                                                    marginTop: 16
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Image
                                                        style={{ width : 80, height : 80, borderRadius: 10 }}
                                                        source={{ uri : 'http://10.0.2.2:8000/static/'+ item.market_img }}
                                                    />
                                                    <View style={{ justifyContent: 'flex-start', alignItems: "flex-end" }}>
                                                        <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }}>With Top Rating</Text>
                                                        <View style={{ flexDirection : 'row', marginRight: 6, marginTop: 4 }}>
                                                            <FoodIcon name="star" size={20} color="orange" />
                                                            <FoodIcon name="star" size={20} color="orange" />
                                                            <FoodIcon name="star" size={20} color="orange" />
                                                            <FoodIcon name="star" size={20} color="orange" />
                                                            <FoodIcon name="star" size={20} color="orange" />
                                                            <Text style={{ color: 'orange', fontSize: 16 }}>{item.market_rating}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ flex : 1, marginHorizontal : 5, marginTop : 8 }}>
                                                    <View style={{ flexDirection : 'row', alignItems : 'center' }}>
                                                        <AntIcon name="checksquare" size={21} color="#4caf50" />
                                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontWeight : '500', fontSize : 16, maxWidth: 250 }}> {item.market_name}</Text>
                                                    </View>
                                                    <Text style={{ fontSize : 12.5, marginTop : 5, maxWidth : 250 }}>{item.market_product_name}</Text>
                                                    <View style={{ flexDirection : 'row', marginTop : 3, flex : 1 }}>
                                                        

                                                        <View style={{ flexDirection : 'row', marginRight: 6 }}>
                                                            <IonIcon name="location" size={18} color="#d32f2f" />
                                                            <Text>{item.market_location}</Text>
                                                        </View>
                                                        <View style={{ flexDirection : 'row', marginRight: 6 }}>
                                                            <IonIcon name="time" size={18} color="#009688" />
                                                            <Text>{item.market_estimate}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{ flexDirection : 'row', marginTop : 4 }}>
                                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3 }}>Discount 50%</Text>
                                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3, marginLeft : 10 }}>Free Ongkir</Text>
                                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3, marginLeft : 10 }}>Bonus ++</Text>
                                                    </View>
                                                </View>
                                            
                                            </TouchableOpacity>
                                        )
                                    })
                                )
                            }
                            <View style={{width: 12}}/>
                        </ScrollView>

                        <View style={{
                            borderBottomColor: '#eeeeee',
                            borderBottomWidth: 6,
                            marginBottom: 24
                        }}/>

                        <Text style={styles.popularmarket} onPress={() => console.log(this.state.favouriteds)}>Your Favourited Market</Text>
                        <View style={{height: 10}}/>
                        {
                            this.state.favouriteds.length > 0 ?
                            (
                                this.state.favouriteds.map(item => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            activeOpacity={0.9}
                                            onPress={() => this.props.navigation.navigate('Detail', {
                                                userId : this.state.userId,
                                                marketId : item.id
                                            })}
                                            style={{ 
                                                backgroundColor : 'white',
                                                elevation : 5,
                                                padding : 10,
                                                borderRadius : 10,
                                                flexDirection : 'row',
                                                marginHorizontal: 16,
                                                marginVertical: 6
                                            }}
                                        >
                                            <Image
                                                style={{ width : 120, height : 120, borderRadius: 10 }}
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

                                                <View style={{ flexDirection : 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3 }}>Discount 50%</Text>
                                                        <Text style={{ color : '#4caf50' ,borderColor : '#4caf50', borderWidth : 1, paddingHorizontal : 3, marginLeft : 10 }}>Free Ongkir</Text>
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.unfavItem(item.id)}>
                                                        <AntIcon name="heart" size={21} color="#4caf50" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        
                                        </TouchableOpacity>
                                    )
                                })
                            ) :
                            (
                                <View style={styles.emptyTrans}>
                                    <Image style={{ width: 200, height: 200 }} source={Fav}/>
                                    <Text style={{ fontSize: 16, fontWeight : '600' }}>Belum Ada Favourite</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.props.navigation.navigate('Shop', {
                                            userId : this.state.userId
                                        })}
                                        style={styles.btnCheckout}>
                                        <LinearGradient
                                            colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                                            style={styles.btnCheckoutColor}>
                                        <Text style={styles.btnCheckoutText}>Cari Market</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        <View style={{height : 50}}/>

                    </ScrollView>
                </View>
                
                {!this.state.isKeyboadVisible && (
                <BottomNav navigation={this.props.navigation} current="Favourite" userId={this.state.userId}/>
                )}
            </View>
        );
    }
}

export default Favorite;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content : {
        flex: 1,
    },
    header : {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    headerBar : {
       justifyContent: 'center', 
       alignItems: 'flex-start', 
       flex: 1,
    },
    headerViewText : {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1
    },
    headerText : {
       fontSize: 18, 
       color: 'black', 
       fontWeight: '600'
    },
    headerVIcon : {
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        flex: 1
    },
    toptitle : {
        marginTop: 24,
        marginHorizontal: 24
    },
    maintitle : {
        fontSize: 16,
        fontWeight: '500',
        color: 'grey'
    },
    bigtitle : {
        fontSize: 24,
        fontWeight: '600',
        color: 'black'
    },
    inputtop : {
        height: 48,
        backgroundColor: 'white',
        margin: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textinput : {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginRight: 16,
        elevation: 5,
        height: 48,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 14
    },
    inputext : {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '400'
    },
    filterbtn : {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14
    },
    filtericon : {
        height: 24,
        width: 24
    },
    popularmarket : {
        marginLeft: 24,
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
    },
    poplarContent: {
    },
    emptyTrans : {
        alignItems: 'center',
        marginTop: 16
    },
    btnCheckout : {
        marginTop: 16,
        marginHorizontal: 24,
        marginBottom: 32,
        width: 200
    },
    btnCheckoutColor : {
        padding: 15,
        borderRadius: 8,
        elevation: 5
    },
    btnCheckoutText : {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center'
    },
})