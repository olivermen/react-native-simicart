import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class AccountInformation extends React.Component {

    navigateProfile = (mode) => {
        NavigationManager.openPage(this.props.navigation, 'Profile', { mode: mode })
    }

    Card = props => {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{props.title}</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={props.onPress}>
                        <Text style={{ fontSize: 14, color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                            {Identify.__('EDIT')}
                        </Text>
                        <Image source={require('./icon-edit.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                {props.children}
            </View>
        )
    }

    render() {
        const { data } = this.props.parent
        return (
            <>
                <Text style={styles.title}>{Identify.__('Account Information')}</Text>
                <View style={styles.line} />

                <this.Card
                    title={Identify.__('Contact Information')}
                    onPress={() => this.navigateProfile(-1)}
                >
                    <View style={styles.info}>
                        <Text style={{ fontSize: 14, paddingBottom: 6 }}>{data.firstname} {data.lastname}</Text>
                        <Text style={{ fontSize: 14 }}>{data.email}</Text>
                        <TouchableOpacity
                            style={{ position: 'absolute', bottom: 20, left: 20 }}
                            onPress={() => this.navigateProfile(1)}
                        >
                            <Text style={styles.txtChangePass}>{Identify.__('Change Password')}</Text>
                        </TouchableOpacity>
                    </View>
                </this.Card>

                <this.Card
                    title={Identify.__('Newsletter')}
                    onPress={() => NavigationManager.openPage(this.props.navigation, 'Newsletter')}
                >
                    <Text style={{ fontSize: 14, paddingBottom: 40, paddingTop: 10, paddingHorizontal: 20, textAlign: 'left' }}>
                        {data.news_letter === '1' ? Identify.__('You are subscribed to our newsletter') : Identify.__('You aren\'t subscribed to our newsletter')}
                    </Text>
                </this.Card>
            </>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'left'
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: '#D8D8D8',
        marginTop: 10,
        marginBottom: 20
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        marginBottom: 15
    },
    header: {
        height: 55,
        paddingHorizontal: 20,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8'
    },
    icon: {
        width: 20,
        height: 21
    },
    info: {
        height: 105,
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-start'
    },
    txtChangePass: {
        fontSize: 15,
        color: '#E4531A',
        textDecorationLine: 'underline',
        fontWeight: '600'
    }
})

