import { View, Text, StyleSheet, Keyboard, TouchableOpacity, TextInput, ScrollView, Dimensions, Image } from "react-native";
import React, { Component } from 'react';
import BottomNav from "../component/BottomNav";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AntIcon from 'react-native-vector-icons/dist/AntDesign'
import Number from "../component/Number";
import { TransactionsPic } from "../assets";

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId: this.props.route.params.userId,
            isKeyboadVisible: false,
            searchTrans: "",
            statustrans: [
                "Semua Status",
                "Semua Makanan",
                "Status Sukses",
                "Status Gagal",
                "Status Terkirim",
                "Status Pending",
                "Status Sampai"
            ],
            products : []
         };
    }

    componentDidMount() {
        this.getAllTransactions()
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

    getAllTransactions = () => {
        fetch('http://10.0.2.2:3000/api/transaction/' + this.state.userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': 'RAHASIA'
            }
        })
        .then(response => response.json())
        .then(async json => {
            const dataproducts = []
            await json.data.map(async trans => {
                await fetch('http://10.0.2.2:3000/api/products/detail/' + trans.product_id, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-API-Key': 'RAHASIA'
                    }
                })
                .then(response => response.json())
                .then(json => {
                    dataproducts.push(json.data)
                    this.setState({products: dataproducts})
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


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headercontent}>
                    <LinearGradient
                        style={styles.header}
                        colors = {['#66bb6a', '#66bb6a', '#4caf50']}>

                        <View style = {styles.headerViewText}>
                            <TouchableOpacity
                                onPress={() => {}} 
                                style={{ 
                                    backgroundColor: 'white',
                                        marginRight: -30,
                                        zIndex : 10
                                }}>
                                <Icon name="search" size={21} color="#4caf50" />
                            </TouchableOpacity>
                            <TextInput
                                onChangeText={text => this.setState({searchTrans : text})}
                                placeholder='Search Your Transaction Here'
                                style = {{ 
                                    backgroundColor: 'white', 
                                    height: 38, width: '70%', 
                                    borderRadius: 10, 
                                    paddingRight : 15,
                                    paddingLeft : 40,
                                 }}
                            />
                            <View style={{ flex: 1 }}/>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('Cart', {
                                userId : this.state.userId
                            })}>
                                <Icon name="shopping-basket" size={21} color="white"/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}
                                style={{ 
                                    marginHorizontal: 16
                                }}
                            >
                                <Icon name="shopping-cart" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}>
                                <Icon name="bars" size={21} color="white" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.content}>
                    <ScrollView style={{ flex: 1 }}>

                        <ScrollView style={styles.statuss} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View width={10}/>
                            {
                                this.state.statustrans.map(status => {
                                    return (
                                        <View key={status} style={styles.itemStatus}>
                                            <Text style={styles.statusText}>{status}</Text>
                                            <Icon name="chevron-down" size={16} color="grey" />
                                        </View>
                                    )
                                })
                            }
                            <View width={10}/>
                        </ScrollView>
                        
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.info}>
                                <AntIcon name="infocirlceo" size={21} color="#53BF57" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.infotitle}>Perbanyak pesanan</Text>
                                    <Text style={styles.infodesc}>Dapatkan bonus tiap 10 kali pemesanan</Text>
                                    <Text style={styles.panduantext}>Baca Panduan</Text>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <AntIcon name="infocirlceo" size={21} color="#53BF57" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.infotitle}>Top Up Sekarang</Text>
                                    <Text style={styles.infodesc}>Dapatkan bonus khsus hari ini</Text>
                                    <Text style={styles.panduantext}>Baca Panduan</Text>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.topup}>
                            <Icon name="money-bill-wave" size={21} color="#53BF57"/>
                            <Text style={styles.topuptext}>Top Up Go F Money Dengan Promo</Text>
                            <View style={{ flex : 1 }}/>
                            <AntIcon name="right" size={21} color="grey" />
                        </View>

                        <View style={{
                            marginTop : 25,
                            borderBottomColor: '#eeeeee',
                            borderBottomWidth: 6,
                        }}/>

                        <View style={styles.mainContent}>
                            <Text style={styles.maincontenttitlte} onPress={() => console.log(this.state.products)}>Riwayat Tansaksi</Text>
                            {
                                this.state.products.length > 0 ?
                                (
                                    this.state.products.map(item => {
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
                                                        <Text>Status : </Text>
                                                        <Text style={{ color: '#53BF57', backgroundColor: '#C6FFC8', paddingHorizontal: 4, fontWeight: '900' }}>Success</Text>
                                                    </View>
                                                    <View style={{ flex : 1 }}/>
                                                    <View style={{ flexDirection : 'row', alignItems : 'center' }}>
                                                        <View style={{ flex : 1, flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{
                                                                    color: 'orange',
                                                                    fontSize: 20
                                                                }}><Number number={item.product_price}/></Text>
                                                        </View>
                                                        <TouchableOpacity activeOpacity={0.5} >
                                                            <LinearGradient
                                                                style={styles.btnbelilagi}
                                                                colors = {['#66bb6a', '#66bb6a', '#4caf50']}>
                                                                <Text style={{ color: 'white' }}>Beli Lagi</Text>
                                                            </LinearGradient>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                ) : (
                                    <View style={styles.emptyTrans}>
                                        <Image style={{ width: 200, height: 200 }} source={TransactionsPic}/>
                                        <Text style={{ fontSize: 16, fontWeight : '600' }}>Belum Ada Transaksi</Text>
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
                                    </View>
                                )
                            }
                        </View>


                    </ScrollView>
                </View>
                
                {!this.state.isKeyboadVisible && (
                    <BottomNav userId={this.state.userId} navigation={this.props.navigation} current="Transaction"/>
                )}
            </View>
        );
    }
}

export default Transactions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
    },
    header : {
        paddingHorizontal: 20,
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
        alignItems: 'center', 
        flex: 1,
        flexDirection : 'row',
    },
    headerText : {
       fontSize: 18, 
       color: 'white', 
       fontWeight: '900'
    },
    statuss : {
        flexDirection: 'row',
        paddingVertical : 16,
    },
    itemStatus : {
        marginHorizontal: 5,
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        elevation: 3,
        marginVertical: 5,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusText : {
        fontSize: 14,
        fontWeight: '500',
        marginRight: 8
    },
    info : {
        height: 100,
        backgroundColor: '#C6FFC8',
        borderWidth : 1.5,
        borderColor: '#53BF57',
        marginHorizontal : 16,
        borderRadius: 12,
        width: Dimensions.get('window').width - 32,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    detailInfo : {
        marginLeft: 12
    },
    infotitle : {
        fontSize: 14,
        fontWeight: '700',
        color: 'black'
    },
    infodesc : {
        fontSize: 14,
        color: 'black',
        marginTop:2
    },
    panduantext : {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '800',
        color: '#53BF57'
    },
    topup : {
        height : 50,
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        borderRadius: 12
    },
    topuptext : {
        marginLeft: 16,
        fontSize: 14,
        fontWeight: '400',
        color: 'black'
    },
    mainContent : {
        margin: 24
    },
    maincontenttitlte : {
        fontSize: 20,
        color: 'black',
        fontWeight: '600',
        marginBottom: 12
    },
    btnbelilagi : {
        backgroundColor: '#53BF57',
        paddingVertical: 5,
        paddingHorizontal: 35,
        borderRadius: 8
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