import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import FoodIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/dist/Ionicons'
import { FlatGrid } from 'react-native-super-grid';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId : this.props.route.params.userId,
            marketId: this.props.route.params.marketId,
            marketData : {},
            products : []
        };
    }

    componentDidMount() {
        this.getDetailMarket()
        this.getProductsByMarketId()
    }

    getDetailMarket = () => {
        fetch('http://10.0.2.2:3000/api/market/detail/'+this.state.marketId, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({marketData : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    getProductsByMarketId = () => {
        fetch('http://10.0.2.2:3000/api/products/get/' + this.state.marketId, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({products : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <View style={{ flex : 1 }}>
                <StatusBar translucent backgroundColor={"transparent"}/>

                <View>
                    <ImageBackground
                        style={{ height : 210 }}
                        source={{ uri : 'http://10.0.2.2:8000/static/'+this.state.marketData.market_img }}>
                        <View style={{ marginTop : 30, marginLeft : 10, flexDirection : 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack({
                                        userId : this.state.userId
                                    })
                                }} 
                                style = {{
                                    backgroundColor: '#9e9e9e',
                                    alignItems : 'center',
                                    justifyContent : 'center',
                                    padding : 5,
                                    opacity : 0.7,
                                    borderRadius : 50
                                }}>
                                <Icon name="arrow-left" size={28} color="white"/>
                            </TouchableOpacity>
                            <View style={{ flex : 1 }}/>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('Shop', {
                                        userId : this.state.userId
                                    })
                                }}
                                style = {{
                                    backgroundColor: '#9e9e9e',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 5,
                                    marginRight: 10, 
                                    opacity: 0.7,
                                    borderRadius: 50
                                }}>
                                <Icon name="search" size={27} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    <View style={{ backgroundColor : 'white' }}>
                        <View style = {{
                            margin: 12,
                        }}>
                            <View style={{  flexDirection : 'row', alignItems : 'center'}}>
                                <AntIcon name="checksquare" size={26} color="#4caf50" />
                                <Text style={{ fontSize : 24, marginLeft : 10, fontWeight : '500' }}>{this.state.marketData.market_name}</Text>
                            </View>
                            <Text style={{ marginTop : 10 }}>{this.state.marketData.market_product_name}</Text>
                            <View style={{ marginTop : 15 }}>
                                <View style={{ flexDirection : 'row', alignItems :'center' }}>
                                    <View
                                        style = {{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                        <FoodIcon name="star" size={20} color="orange" />
                                        <FoodIcon name="star" size={20} color="orange" />
                                        <FoodIcon name="star" size={20} color="orange" />
                                        <FoodIcon name="star" size={20} color="orange" />
                                        <FoodIcon name="star" size={20} color="orange" />
                                        <Text style={{ fontSize : 15, marginLeft : 5 }}>{this.state.marketData.market_rating}</Text>
                                    </View>
                                    
                                    <View style={{ backgroundColor : '#ababab', width : 1, height : '100%', marginLeft : 20 }}/>

                                    <View 
                                        style={{ 
                                            flex : 1,
                                            marginLeft : 20,
                                            flexDirection : 'row',
                                            alignItems : 'center'
                                        }}
                                    >
                                        <IonIcon name="time-outline" size={21} color="grey" />
                                        <Text style={{ marginLeft : 5 }}>{this.state.marketData.market_estimate}</Text>
                                    </View>
                                    
                                    <TouchableOpacity>
                                        <Icon name="heart" size={21} color="grey" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{
                            marginTop : 20,
                            borderBottomColor: '#eeeeee',
                            borderBottomWidth: 12,
                        }}/>

                        <View style={{ backgroundColor : 'white' }}>
                            <View style={{ margin : 10 }}>
                                <Text style={{ fontSize : 15 }}>Menu - Menu Dari {this.state.marketData.market_name}</Text>
                            </View>

                            <View>
                                <FlatGrid
                                    itemDimension={250}
                                    data={this.state.products}
                                    keyExtractor={this.state.products.id}
                                    renderItem={({item, index}) => (
                                        <View style={{ flexDirection : 'row', padding : 10, backgroundColor : 'white', elevation : 5, borderRadius : 10 }}>
                                            <Image
                                                style={{ height : 100, width :100 }}
                                                source={{ uri : 'http://10.0.2.2:8000/static/'+item.product_img }}
                                            />
                                            <View style = {{ marginLeft: 10, flex : 1 }}>
                                                <View>
                                                    <Text style={{ fontSize : 15, fontWeight : '500' }}>{item.product_name}</Text>
                                                </View>
                                                <View style={{ marginTop : 5, flexDirection : 'row', alignItems : 'center' }}>
                                                    <Text>Status : {item.product_status}</Text>
                                                    <View style={{ backgroundColor : '#ababab', width : 1, height : '70%', marginHorizontal : 15}}/>
                                                    <Text>Tersedia {item.product_stock} Porsi</Text>
                                                </View>
                                                <View style={{ flex : 1 }}/>
                                                <View style={{ flexDirection : 'row', alignItems : 'center' }}>
                                                    <View style={{ flex : 1 }}>
                                                        <Text style={{ color : 'orange', fontSize : 20 }}>Rp. {item.product_price}</Text>
                                                    </View>
                                                    <AntIcon name="plussquare" size={25} color="#4caf50" />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                
                <View style={{ flex : 1 }}>
                    
                </View>

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
                        display : 'none'
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
            </View>
        );
    }
}

export default Detail;