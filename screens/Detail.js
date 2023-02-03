import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ImageBackground, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import FoodIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/dist/Ionicons'
import Number from '../component/Number';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId : this.props.route.params.userId,
            marketId: this.props.route.params.marketId,
            marketData : {},
            products : [],
            carts : [],
            modalIsOpen: false,
            loading: false,
            favorited: false
        };
    }

    componentDidMount() {
        this.checkfavorited()
        this.getDetailMarket()
        this.getProductsByMarketId()
    }

    getTotal = () => {
        let total = 0
        this.state.carts.map(cart => {
            total += parseInt(cart.product_price * cart.qty)
        })

        return total
    }

    checkExist = (id) => {
        let total = 0
        this.state.carts.map(cart => {
            if (cart.id == id) {
                total += 1
            }
        })
        return total > 0
    }

    addCart = (cart) => {
        const addnewcart = []
        this.state.carts.map(currentCart => {
            addnewcart.push(currentCart)
        })

        if (addnewcart.length > 0) {
            if (this.checkExist(cart.id)) {
                addnewcart.map(carts => {
                    if (carts.id == cart.id) {
                        carts.qty += 1
                    }
                })
            } else {
                cart.qty = 1
                addnewcart.push(cart)
            }
            this.setState({carts : addnewcart})
        } else {
            cart.qty = 1
            addnewcart.push(cart)
            this.setState({carts : addnewcart})
        }
    }
    
    minCart = (id) => {
        const addnewcart = []
        this.state.carts.map(currentCart => {
            addnewcart.push(currentCart)
        })
        addnewcart.map(cart => {
            if (cart.id == id) {
                if (cart.qty == 1) {
                    const filtered = addnewcart.filter(cartf => cartf.id != cart.id)
                    this.setState({carts : filtered})
                } else {
                    cart.qty -= 1
                    this.setState({carts : addnewcart})
                }
            }
        })
    }

    showCartsItem = () => {
        this.setState({modalIsOpen : true})
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

    addToCart = () => {
        this.setState({modalIsOpen : false})
        this.setState({loading: true})
        let success = 0
        this.state.carts.map(cart => {
            fetch('http://10.0.2.2:3000/api/cart/add', {
                method : 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                },
                body : JSON.stringify({
                    "product_id": parseInt(cart.id),
                    "user_id": this.state.userId,
                    "qty": parseInt(cart.qty),
                    "status": "cart"
                })
            })
            .then(response => response.json())
            .then(json => {
                if (success >= this.state.carts.length - 1) {
                    this.setState({loading : false})
                    this.props.navigation.replace('Cart', {
                        userId: this.state.userId
                    })
                }
                success += 1
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

    checkfavorited = () => [
        fetch('http://10.0.2.2:3000/api/favourite/check', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body: JSON.stringify({
                "market_id": parseInt(this.state.marketId),
                "user_id": this.state.userId
            })
        })
        .then(response => response.json())
        .then(json => {
            if (json.data.id != 0) {
                this.setState({favorited: true})
            }
        })
        .catch(err => {
            console.log(err)
        })
    ]

    favoriteButton = () => {
        if (this.state.favorited) {
            this.setState({favorited: false})
            fetch('http://10.0.2.2:3000/api/favourite/delete', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                },
                body: JSON.stringify({
                    "market_id": parseInt(this.state.marketId),
                    "user_id": this.state.userId
                })
            })
            .then(response => response.json())
            .then(json => {
                console.log(json.data)
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            this.setState({favorited: true})
            fetch('http://10.0.2.2:3000/api/favourite/add', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                },
                body: JSON.stringify({
                    "market_id": parseInt(this.state.marketId),
                    "user_id": this.state.userId
                })
            })
            .then(response => response.json())
            .then(json => {
                console.log(json.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    render() {
        return (
            <View style={{ flex : 1 }}>
                
                <StatusBar translucent backgroundColor={"transparent"}/>

                <ScrollView>
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
                                    
                                    <TouchableOpacity style={{ marginRight : 10 }} onPress={() => this.favoriteButton()}>
                                        {
                                            this.state.favorited ?
                                            <AntIcon name="heart" size={21} color="#4caf50" /> :
                                            <Icon name="heart" size={21} color="grey" />
                                        }
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

                            <View style={{ marginBottom: 100 }}>
                                {
                                    this.state.products.map(item => {
                                        return (
                                            <View key = {item.id}
                                            style = {{
                                                flexDirection: 'row',
                                                padding: 10,
                                                backgroundColor: 'white',
                                                elevation: 5,
                                                borderRadius: 10,
                                                margin: 10
                                            }}>
                                                <Image
                                                    style={{ height : 100, width :100, borderRadius: 10 }}
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
                                                            <Text style={{
                                                                    color: 'orange',
                                                                    fontSize: 20
                                                                }}><Number number={item.product_price}/></Text>
                                                        </View>
                                                        {
                                                            this.state.carts.map(cart => {
                                                                if(cart.id == item.id) {
                                                                    return (
                                                                        <>
                                                                            <TouchableOpacity key={cart.id} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.minCart(cart.id)} activeOpacity={0.5}>
                                                                                <AntIcon name="minussquare" size={25} color="#FF5656" />
                                                                                <Text style={styles.qtytext}>{cart.qty}</Text>
                                                                            </TouchableOpacity>
                                                                        </>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.addCart(item)}>
                                                            <AntIcon name="plussquare" size={25} color="#4caf50" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                    
                </ScrollView>
                
                {
                    this.state.carts.length > 0 &&
                    (
                        <View style={styles.cartCntainer}>

                            <View style={styles.itemscontainer} >
                                <Text style={styles.totalText}>Total items :</Text>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => this.showCartsItem()}>
                                    <LinearGradient
                                        style={styles.items}
                                        colors={['#66bb6a', '#66bb6a', '#4caf50']}
                                    >
                                        <IonIcon name="fast-food-outline" size={21} color="white" />
                                        <Text style={styles.totalItems}>{this.state.carts.length} Items Selected</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity style={{ width : '50%' }} activeOpacity={0.5} onPress={() => this.addToCart()}>
                                <LinearGradient
                                    style={styles.cartBtn}
                                    colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                                    <Icon name="shopping-basket" size={21} color="white" />
                                    <Text style={styles.cartText}>Add to Cart</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    )
                }

                <Modal
                    isVisible={this.state.modalIsOpen}
                    onBackdropPress={() => this.setState({modalIsOpen : false})}
                    animationInTiming={600}
                    animationOutTiming={600}
                    >

                    <View 
                        style = {styles.modalHeader}>
                        <IonIcon name="fast-food-outline" size={21} color="white" />
                        <Text style={styles.modalInfo}>All Items</Text>
                    </View>

                    <View style={styles.modalBody} >
                        {
                            this.state.carts.map(cart => {
                                return (
                                    <View key={cart.id} style={styles.cartModal}>
                                        <Image style={styles.cartImg} source={{ uri: 'http://10.0.2.2:8000/static/'+cart.product_img }}/>
                                        <View style={styles.cartDetail}>
                                            <Text style={styles.cartPName}>{cart.product_name}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                                <Text style={styles.cartPtPrice}><Number number={cart.product_price}/></Text>
                                                <Text style={{ fontWeight: '600' }}> x {cart.qty} = </Text>
                                                <Text style={styles.cartPtPrice}><Number number={cart.qty * cart.product_price}/></Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.modalTotal}>
                            <Text style={styles.totaltextModal}>Total : </Text>
                            <Text style={styles.totalPrice}><Number number={this.getTotal()}/></Text>
                        </View>
                    </View>
                    
                    <View style={styles.modalHr} />

                    <View style={styles.modalBtnBody}>
                        <TouchableOpacity
                            onPress={() => this.setState({modalIsOpen : false})}
                            style={styles.modalBtnStay}>
                            <IonIcon name="close-circle-outline" size={21} color="white" />
                            <Text style={styles.modalBtnText}>Tutup</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.addToCart()
                            }}
                            style={styles.modalBtnSignin}>
                            <Icon name="shopping-basket" size={18} color="white" />
                            <Text style={styles.cartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {
                    this.state.loading &&
                    (
                        <View style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems : 'center',
                            backgroundColor: 'rgba(0,0,0, 0.3)',
                        }}>
                            <ActivityIndicator
                                size={50}
                            />
                        </View>
                    )
                }
            </View>
        );
    }
}

export default Detail;

const styles = StyleSheet.create({
    cartCntainer : {
        backgroundColor : 'white',
        width : '100%',
        position : 'absolute',
        height : 70,
        flexDirection : 'row',
        bottom : 0,
        elevation : 10,
        justifyContent : 'space-between',
        alignItems: 'center'
    },
    qtytext : {
        marginHorizontal : 5,
        fontWeight : 'bold',
    },
    cartBtn : {
        width : '100%',
        height : 70,
        justifyContent: 'center',
        alignItems : 'center',
        borderTopLeftRadius : 30,
        flexDirection : 'row'
    },
    cartText : {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    itemscontainer : {
        justifyContent: 'center',
        alignItems: 'center',
        width : '50%',
    }, 
    items : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems : 'center',
        borderRadius : 12,
        paddingVertical : 5,
        paddingHorizontal : 10
    },
    totalItems : {
        marginLeft : 6,
        color : 'white',
        fontWeight : '600'
    },
    totalText : {
        fontWeight : 'bold'
    },
    modalHeader : {
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10
    },
    modalInfo : {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginLeft: 10
    },
    modalBody : {
        backgroundColor: 'white',
        padding: 15
    },
    modalHr : {
        borderBottomColor: 'grey',
        borderBottomWidth: 0.2
    },
    modalBtnBody : {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    modalBtnStay : {
        backgroundColor: 'grey',
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBtnSignin : {
        backgroundColor: '#4caf50',
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row'
    },
    modalBtnText : {
        color: 'white', 
        fontWeight: 'bold',
        marginLeft: 6
    },
    cartImg : {
        width: 70,
        height: 70,
        borderRadius : 12
    },
    cartModal : {
        flexDirection : 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    cartDetail: {
        marginLeft: 10
    },
    cartPName : {
        fontSize : 16,
        fontWeight: '600'
    },
    cartPtPrice : {
        fontSize : 14,
        fontWeight : '900',
        color : 'orange'
    },
    modalTotal : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginTop : 16
    },
    totalPrice : {
        fontSize : 18,
        color : 'orange',
        fontWeight : '900'
    },
    totaltextModal : {
        fontSize : 16,
        fontWeight : 'bold'
    }
})