import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import React, { Component } from 'react';
import { Payment } from "../assets";
import LinearGradient from 'react-native-linear-gradient';

class Success extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId: this.props.route.params.userId,
         };
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={Payment}/>
                <Text style={styles.title}>Payment Success!</Text>
                <Text style={styles.desc}>Pembayaran Berhasil, Tunggu Makanan Hingga Sampai Ke Tempat Mu</Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.replace('Home', {
                        userId : this.state.userId
                    })}
                    style={styles.btnCheckout}>
                    <LinearGradient
                        colors = { ['#81c784', '#66bb6a', '#4caf50'] }
                        style={styles.btnCheckoutColor}>
                    <Text style={styles.btnCheckoutText}>Home</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Success;

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img : {
        width : 300,
        height : 200
    },
    desc: {
        width: 214,
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        color: 'grey'
    },
    title : {
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
        marginTop: 20
    },
    btnCheckout : {
        marginTop: 30,
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