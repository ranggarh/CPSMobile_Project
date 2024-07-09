import React from 'react';
import { Box, Heading, Text, ScrollView, Image } from 'native-base';
import { useRoute } from '@react-navigation/native';

const DetailFAQ = () => {
    const route = useRoute();
    const { faq } = route.params;

    const renderAnswers = () => {
        const answers = [];
        for (let i = 1; i <= 16; i++) {
            const answerKey = `jawaban${i}`;
            if (faq[answerKey]) {
                answers.push(
                    <Text key={i} mt={2}>{faq[answerKey]}</Text>
                );
            }
        }
        return answers;
    };

    return (
        <ScrollView flex={1} p={5} backgroundColor="white">
            <Box>
            <Image m={8} alignSelf={'center'} source={require('../assets/icon_helpdesk.png')} style={{ width: 250, height: 200, borderRadius: 10 }} alt="Selamat Datang ICON"></Image>
                <Text fontWeight={'bold'} fontSize={20}>{faq.nama}</Text>
                {renderAnswers()}
            </Box>
            
        </ScrollView>
    );
};

export default DetailFAQ;
