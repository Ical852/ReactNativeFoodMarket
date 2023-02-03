import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import slider from "./SLIDER";
import { CartImg, EmtpyCart } from "../assets";
import IonIcon from 'react-native-vector-icons/dist/Ionicons'
import Number from '../component/Number';
import { WebView } from "react-native-webview";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            sliderData: slider.data2,
            userId: this.props.route.params.userId,
            carts: [],
            total: 0,
            payment_url : "",
            user : {}
         };
    }

    removeCart = (id) => {
        fetch('http://10.0.2.2:3000/api/cart/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            },
            body : JSON.stringify({
                "product_id": parseInt(id),
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

        const filtered = this.state.carts.filter(cart => cart.id != id)
        let newTotal = 0

        filtered.map(cart => {
            newTotal += (cart.product_price * cart.qty)
        })
        this.setState({total: newTotal})
        this.setState({carts : filtered})
    }

    componentDidMount() {
        this.getAllCarts()
        this.getUsers()
    }

    getUsers = () => {
        fetch('http://10.0.2.2:3000/api/user/get/' + this.state.userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            this.setState({user : json.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    getAllCarts = async () => {
        await fetch('http://10.0.2.2:3000/api/cart/get/' + this.state.userId, {
            method : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(json => {
            let dataproduct = []
            let totalprice = 0
            json.data.map( async data => {
                await fetch('http://10.0.2.2:3000/api/products/detail/' + data.product_id, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-API-Key': 'RAHASIA'
                    }
                })
                .then(response => response.json())
                .then(json => {
                    json.data.qty = data.qty
                    dataproduct.push(json.data)
                    this.setState({carts: dataproduct})

                    totalprice += (data.qty * json.data.product_price)
                    this.setState({total: totalprice})
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

    checkout = () => {
        this.state.carts.map((cart, index) => {
            fetch('http://10.0.2.2:3000/api/cart/delete', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                },
                body : JSON.stringify({
                    "product_id": parseInt(cart.id),
                    "user_id": this.state.userId
                })
            })

            fetch('http://10.0.2.2:3000/api/transaction', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': 'RAHASIA'
                },
                body : JSON.stringify({
                    "order_id": Math.floor(Math.random() * 100000) + 1,
                    "gross_amount": this.state.total,
                    "user_id": this.state.userId,
                    "product_id": cart.id,
                    "status": index == 0 ? "success" : "nolink",
                    "full_name": this.state.user.full_name,
                    "email": this.state.user.email,
                    "phone": this.state.user.phone_number
                })
            })
            .then(response => response.json())
            .then(json => {
                if (json.data.payment_url != "join") {
                    this.setState({payment_url : json.data.payment_url})
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

    finish = () => {
        this.setState({payment_url : ""})
        setTimeout(() => {
            this.props.navigation.replace('Success', {
                userId: this.state.userId
            })
        }, 1000);
    }

    render() {
        return this.state.payment_url != "" ?
        <>
            <View>
                <LinearGradient
                    style={styles.header}
                    colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                    <TouchableOpacity style={styles.headerBar} onPress={() => this.finish()}>
                        <Icon name="arrow-left" size={25} color="white" />
                    </TouchableOpacity>
                    <View style = {styles.headerViewText}>
                        <Text style={styles.headerText}>Order Payment</Text>
                    </View>
                    <View style = {styles.headerVIcon}>
                    </View>
                </LinearGradient>
            </View>
            <WebView
                source={{ uri: this.state.payment_url }}
            />
        </>
        : (
            <ScrollView style={styles.container}>
                <View>
                    <LinearGradient
                        style={styles.header}
                        colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                        <TouchableOpacity style={styles.headerBar} onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>

                        <View style = {styles.headerViewText}>
                            <Text style={styles.headerText}>Your Carts</Text>
                        </View>

                        <View style = {styles.headerVIcon}>
                            <View style={{ flexDirection : 'row',  }}>
                                <TouchableOpacity style={{ marginRight : 20 }} >
                                    <AntIcon name="heart" size={21} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon name="search" size={21} color="white"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
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
                    >All Promos For You <Text style={{ fontWeight : '500' }}> -  Free Ongkir</Text></Text>
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
                
                <View style={styles.infotext}>
                    <IonIcon name="information-circle-outline" size={21} color="grey" />
                    <Text style={styles.infotexttitle}>Jangan lewatkan promo hari ini !</Text>
                    <Icon name="chevron-down" size={16} color="grey" />
                </View>
                
                <View style={styles.advice}>
                    <Image source={CartImg} style={styles.cartImgAdvice}/>
                    <View style={styles.textadvice}>
                        <Text style={styles.texttitle}>Apa kamu yakin tidak ingin membeli makanan lainnya di go food market?</Text>
                        <Text style={styles.desc}>Khusus hari ini semua makanan gratis ongkir dan ada beberapa yang diskon</Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {}}
                    style={styles.btnBeliLagi}>
                    <LinearGradient
                        colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                        style={styles.btnBeliLagiColor}>
                    <Text style={styles.btnBeliText}>Belanja Lagi</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{
                    marginTop : 20,
                    borderBottomColor: '#eeeeee',
                    borderBottomWidth: 10,
                }}/>

                <View style={styles.content}>
                    <Text style={styles.allcarts}>All of you carts </Text>

                    {
                        this.state.carts.length > 0 ?
                        (
                            this.state.carts.map(item => {
                                return (
                                    <View
                                        key={item.id}
                                        style = {{
                                            flexDirection: 'row',
                                            padding: 10,
                                            backgroundColor: 'white',
                                            elevation: 5,
                                            borderRadius: 10,
                                            marginVertical: 10,
                                            marginHorizontal: -10
                                        }}>
                                        <Image
                                            style={{ height : 100, width :100, borderRadius: 10 }}
                                            source={{ uri : 'http://10.0.2.2:8000/static/'+item.product_img }}
                                        />
                                        <View style = {{ marginLeft: 10, flex : 1 }}>
                                            <View>
                                                <Text style={{ fontSize : 15, fontWeight : '600' }}>{item.product_name}</Text>
                                            </View>
                                            <View style={{ marginTop : 5, flexDirection : 'row', alignItems : 'center' }}>
                                                <Text style={{ fontWeight: '600',  }}>{item.qty} items x </Text>
                                                <Text style={{ color: 'orange' }}><Number number={item.product_price}/> </Text>
                                            </View>
                                            <View style={{ flex : 1 }}/>
                                            <View style={{ flexDirection : 'row', alignItems : 'center' }}>
                                                <View style={{ flex : 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ 
                                                        fontSize: 16,
                                                     }}>Total : </Text>
                                                    <Text style={{
                                                            color: 'orange',
                                                            fontSize: 20
                                                        }}><Number number={item.product_price * item.qty}/></Text>
                                                </View>
                                                <TouchableOpacity activeOpacity={0.5} onPress={() => this.removeCart(item.id)}>
                                                    <AntIcon name="closesquare" size={25} color="#FF5656" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        ) :
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ height : 150, width : 150 }} source={EmtpyCart}/>
                            <Text style={{ marginTop: 20, fontWeight: '600', color: 'grey', fontSize : 16 }}>Belum Ada Makanan Di Keranjang</Text>
                        </View>
                    }
                </View>

                {
                    this.state.carts.length > 0 ?
                    (
                        <>
                            <View style={styles.cartsTotal}>
                                <Text style={{ fontSize: 14, color: 'black' }}>Total : </Text>
                                <Text style={{ fontSize :18, fontWeight: '600', color: 'black' }}><Number number={this.state.total}/></Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.checkout()}
                                style={styles.btnCheckout}>
                                <LinearGradient
                                    colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                                    style={styles.btnCheckoutColor}>
                                <Text style={styles.btnCheckoutText}>Checkout</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) :
                    (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate('Shop', {
                                userId : this.state.userId
                            })}
                            style={styles.btnCheckout}>
                            <LinearGradient
                                colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                                style={styles.btnCheckoutColor}>
                            <Text style={styles.btnCheckoutText}>Cari Makanan</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                }

            </ScrollView>
        );
    }
}

export default Cart;

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor : 'white'
    },
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
    advice : {
        marginTop : 16,
        marginLeft : 24,
        marginRight : 24,
        flexDirection : 'row',
        alignItems: 'center'
    },
    cartImgAdvice : {
        width : 180,
        height : 180,
    },
    textadvice : {
        flex: 1,
        alignItems: 'center',
        marginLeft: 4
    },
    texttitle : {
        fontSize: 16,
        fontWeight : 'bold',
        color: 'black'
    },
    desc : {
        color: 'grey',
        marginTop: 8
    },
    btnBeliLagi : {
        marginTop: 16,
        marginHorizontal: 24,
    },
    btnBeliLagiColor : {
        padding: 8,
        borderRadius: 8,
        elevation: 5
    },
    btnBeliText : {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
        textAlign: 'center'
    },
    infotext: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        marginTop: 16
    },
    infotexttitle : {
        marginLeft : 4,
        color: 'black',
        marginRight: 8
    },
    content : {
        margin: 24,
    },
    allcarts : {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12
    },
    btnCheckout : {
        marginTop: 16,
        marginHorizontal: 24,
        marginBottom: 32
    },
    btnCheckoutColor : {
        padding: 15,
        borderRadius: 15,
        elevation: 5
    },
    btnCheckoutText : {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textAlign: 'center'
    },
    cartsTotal : {
        flexDirection: 'row',
        marginHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    }
})