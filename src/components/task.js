import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native'

import Swipeable from 'react-native-swipeable'
import Icons from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../styles/commonStyles';

export default props => {
    let check = null

    if (props.doneAt !== null) {
        check = (
            <View style={styles.done}>
                <Icons name='check' size={20} color={commonStyles.colors.secondary}></Icons>
            </View>
        )
    } else {
        check = (
            <View style={styles.pending}></View>
        )
    }

    const descStyle = props.doneAt !== null ? { textDecorationLine: 'line-through' } : {}

    const leftContent = (
        <View style={styles.exclude}>
            <Icons name='trash' size={20} color='white'></Icons>
            <Text style={styles.excludeText}>Excluir</Text>
        </View>
    )

    const rightContent = [
        <TouchableOpacity style={[styles.exclude, { justifyContent: 'flex-start', paddingLeft: 20 }]} onPress={() => props.onDelete(props.id)}>
            <Icons name='trash' size={30} color='white'></Icons>
        </TouchableOpacity>
    ]
    

    return (
        <Swipeable leftActionActivationDistance={200}  onLeftActionActivate={() => props.onDelete(props.id)}
            leftContent={leftContent} rightButtons={rightContent}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.toogleCheck(props.id)}>
                    <View style={styles.checkContainer}>{check}</View>
                </TouchableWithoutFeedback>
                <View >
                    <Text style={[styles.description, descStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>
                        {moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}
                    </Text>
                </View>
            </View>
        </Swipeable>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#AAA'
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
    },
    pending: {
        borderWidth: 1,
        height: 25,
        width: 25,
        borderRadius: 15,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subtext,
        fontSize: 20
    },
    exclude: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgb(200,200,200)'
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: 'white',
        fontSize: 20,
        margin: 10
    }
})